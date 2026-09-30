# Weekend Render

## Turning an unfamiliar cloud-rendering problem into a tested product architecture

**Role:** Product / architecture owner and hands-on product engineer  
**Implementation model:** AI-native development with Claude Code, driven by explicit experiments, contracts, acceptance gates, and live infrastructure tests  
**Stack:** Blender 5.2, Flamenco, Python, Railway, RunPod, R2/object storage, SSH/Paramiko, Shaman  
**Status:** POC complete; end-to-end alpha implementation is active and not yet publicly deployed

---

## The product problem

The original problem was simple to state:

> Can an individual Blender user get occasional access to much faster cloud rendering without learning how to operate a render farm?

The useful product had to be much simpler than the infrastructure behind it.

The desired experience became:

1. choose a saved `.blend` file;
2. submit it from Blender;
3. get an estimate before committing to the full cost;
4. let the cloud workflow continue even if Blender closes;
5. monitor or respond later;
6. receive verified output automatically;
7. avoid paying for idle infrastructure.

That meant solving several problems I had not worked with before: Blender farm behavior, Flamenco, Shaman/BAT asset transfer, GPU worker provisioning, RunPod storage/networking, Blender add-on packaging, SSH trust, render reproducibility, output retrieval, and cloud-cost accounting.

Rather than choose an architecture first and make the evidence fit it, I treated the project as a sequence of progressively harder hypotheses.

---

## What I owned

I owned the product decisions and the experimental architecture.

That included:

- deciding what the user experience should hide versus expose;
- identifying technical assumptions that had to be proven before product work depended on them;
- defining POC acceptance cases;
- choosing where durable workflow state should live;
- deciding when cost should become a product decision rather than an infrastructure concern;
- evaluating transport and control-plane alternatives;
- directing Claude Code implementation and experiments;
- interpreting live results and changing the architecture when they invalidated an assumption;
- separating what had been proven from what was still only planned.

That last point became important. Weekend Render has intentionally explicit labels for **PASS**, **FAIL**, and **UNEXECUTED**. Configuration is not treated as proof.

---

## 1. Start with a falsifiable POC, not a product shell

The first substantial artifact was not a UI.

It was an acceptance matrix for the risky parts of the idea.

The POC had to prove, against real infrastructure, questions such as:

- Can the Blender submission host reach a remote Flamenco Manager securely?
- Can the GPU worker join the same farm?
- Can Manager state survive control-pod replacement?
- Can a real project and its external dependencies reach the farm?
- Does Blender actually render on the GPU rather than silently falling back to CPU?
- Can the submission host disconnect after the job is accepted?
- Does the job continue with both the submission and operator hosts disconnected?
- What happens if the GPU worker disappears mid-render?
- Can a replacement worker finish the remaining work without re-rendering completed frames?
- Can output be retrieved and checksum-verified?
- What is the real speedup and what does the cloud run actually cost?

By the end of the POC, every defined acceptance case had an explicit disposition.

### Some of the useful results

A real Blender 5.2 scene rendered successfully through Flamenco on a RunPod RTX 4090 worker.

The cloud worker was measured at about **11.7× faster per frame** than the local GTX 1660 test machine for the measured scene.

More importantly, the workflow survived the conditions that mattered to the product:

- the submission connection could disappear after acceptance;
- the job continued without the submission host connected;
- deleting a worker preserved already completed output;
- a replacement worker resumed the remaining work automatically;
- output retrieval was checksum-verified and resumable.

One test also caught a classic infrastructure false-positive: the first Cycles run had silently used the CPU. The acceptance gate failed, the device configuration was corrected, and OptiX execution was then verified from the render log.

That failure is one of the reasons I value executable acceptance criteria more than architecture diagrams.

---

## 2. The product architecture emerged from the disconnect requirement

A key product requirement eventually became:

> Once the render has been durably accepted, the local Blender process should no longer be responsible for keeping it alive.

That changed the architecture.

The durable coordinator became a Railway service that owns:

- workflow state;
- farm creation and teardown;
- job submission and reconciliation;
- cost/budget state;
- estimate and continuation decisions;
- expected-output identity;
- retrieval into durable object storage;
- previews and client state;
- cleanup obligations.

Blender becomes a client of the workflow, not the workflow host.

This distinction is what makes "safe to close Blender" meaningful rather than cosmetic.

### Why that matters

If the add-on remains responsible for the running job, every laptop sleep, crash, network change, Blender restart, or lost tunnel becomes a workflow-lifecycle problem.

Moving authority into a durable cloud service means the local client can disappear and later reconstruct its useful state from Railway.

That product decision shaped almost every later implementation choice.

---

## 3. I changed the architecture when investigation made earlier ideas unnecessary

Several parts of Weekend Render are useful examples of not protecting an initial architecture.

### Event broker → targeted reconciliation

An early architecture considered MQTT for progressive farm events.

The appeal was obvious: events looked like a clean way to wake the Railway controller as work progressed.

But as I investigated the actual Flamenco control seams, the additional broker started to look like complexity in search of a requirement. The production implementation direction shifted toward Railway driving the workflow through the Manager/farm control path and polling the small set of states it actually needed.

In the current alpha branch, there is no broker dependency in the workflow-completion path: Railway reconciles farm truth through the pinned SSH/control seam.

The important lesson was not "polling is always better."

It was: **do not keep an infrastructure component because it makes the architecture diagram look more event-driven. Keep it only if it solves a demonstrated product problem.**

### Persistent local process → durable cloud coordinator

The initial problem sounded like "let Blender submit to a remote farm."

The product requirement eventually became stronger: Blender should be able to close.

That forced the control plane, decisions, retrieval, and cleanup out of the add-on and into durable cloud state.

### Farm-first submission → upload-first

The latest development branch pushes the separation further.

Instead of bringing up a paid farm before the source is durably off the laptop, the in-progress upload-first design:

1. creates the workflow;
2. grants a signed object-store upload;
3. verifies the uploaded object's size and SHA-256;
4. only then starts paid farm infrastructure;
5. stages the accepted source into the farm.

The source can therefore become durable before GPU availability or farm startup succeeds.

This is still active development, not a shipped claim, but it is a good example of product architecture changing because the UX goal became clearer: **closing Blender should depend on durable acceptance, not on whether a cloud GPU happened to be immediately available.**

---

## 4. Cost became part of the product model

Cloud rendering is easy to demo badly.

If the product hides cost until after a render, the user has traded slow local rendering for financial uncertainty.

I designed estimation as part of the normal workflow rather than an optional expert feature.

Every render is intended to begin with a representative sample. Railway then uses the measured result to estimate the remaining duration and cost.

The product separates two decisions:

- **the service-owned budget** — an authoritative spending limit the user cannot silently override;
- **the user-owned continuation threshold** — "if the projected additional cost is below this amount, continue automatically."

That allows the predominant case to remain unattended without making cost control meaningless.

Actual farm spend is also reconciled separately from render-time estimates. Control-pod time, GPU-pod time, retries, failures, restarts, and directly attributable storage can all matter.

This is a product decision as much as an accounting one: the estimate shown to a user is only trustworthy if the system understands what it actually bills.

---

## 5. Real infrastructure tests drove the engineering details

I deliberately tested the implementation against real components rather than keeping the hard parts behind mocks.

Examples include:

- real Blender 5.2;
- real Flamenco Manager and workers;
- real Shaman submission;
- real SSH forwarding and pinned host identity;
- real RunPod GPU workers;
- live R2/object-store verification;
- real still-image formats;
- actual worker deletion and recovery;
- real cloud timing and cost.

The current implementation branches also include local loopback farms for repeatable testing, fake adapters for fast service tests, and contract fixtures for cross-component boundaries.

That combination matters:

**mocks make iteration fast; real-system probes determine whether the architecture is true.**

---

## 6. The add-on was shaped by actual-use friction, not just backend capability

The Blender add-on evolved through direct use.

Examples from the current alpha work include:

- moving the experience from a cramped sidebar into Blender's Output properties;
- making **Choose File** the first decision rather than assuming the currently open file;
- exposing exactly which scene and frame range will render;
- separating a user-facing render name from the source filename;
- making "safe to close Blender" a distinct accepted state;
- adding visible elapsed time when GPU acquisition takes longer than expected;
- adding Cancel throughout the workflow rather than only before submission;
- hiding warnings that do not affect renderability instead of making the user interpret diagnostic noise;
- keeping detailed diagnostics available for support without putting provider codes, pod names, paths, or secrets into the normal UI.

This is an important counterweight to the infrastructure story.

The product is not "a render farm with a Blender plug-in." The infrastructure exists to make the Blender experience smaller.

---

## 7. Security and failure recovery were designed into the workflow

Because the add-on controls paid cloud infrastructure, I treated trust and cleanup as first-class design problems.

Examples include:

- the local device generates its own SSH key and only enrolls the public half;
- farm host identity is pinned rather than trust-on-first-use;
- credentials live outside the `.blend` file;
- device revocation disables future access;
- object-store transfers are checksum-verified;
- signed URLs are bounded rather than permanent;
- logs intentionally exclude signed URLs, object keys, paths, and content digests where they could become sensitive identifiers;
- farm teardown waits until the system has evidence that the only copy of an output will not be stranded;
- cleanup obligations remain durable when immediate cleanup cannot complete.

The design assumption is that failure is normal: GPU capacity may disappear, a worker can die, a network hop can fail, Blender can close, and cloud cleanup may need to resume later.

A robust workflow records enough state to recover rather than hoping the happy path stays alive.

---

## 8. What is proven versus still in development

I do not want the case study to make the active branch look more finished than it is.

### Proven

The completed POC demonstrated:

- remote Flamenco control;
- GPU rendering;
- dependency transfer;
- host disconnection after accepted submission;
- continued execution without the local submission connection;
- worker-loss recovery;
- verified retrieval;
- measured performance and cost.

The current stacked alpha branches have additionally exercised a Railway-driven estimate/decision/render/retrieval workflow against real RunPod infrastructure and private object storage.

### In development

The current upload-first/add-on work is still active.

Remaining work includes parts of:

- broader GPU-selection/capacity behavior;
- the final notification/control surface;
- release packaging and platform acceptance;
- final live acceptance of the latest upload-first flow.

The source repository is private, but I can provide branch-level access so a technical reviewer can distinguish merged POC evidence from active alpha implementation.

---

## 9. What I would show in a technical review

I would walk through a small set of artifacts:

1. **POC acceptance matrix and results** — demonstrates how assumptions were converted into executable gates.
2. **The CPU-render failure and correction** — an example of a test preventing a false success.
3. **The durable Railway workflow** — shows why Blender can disconnect after acceptance.
4. **A live estimate → decision → pod teardown/recreate → render → R2 retrieval run** — demonstrates the end-to-end control plane.
5. **The add-on start/state model** — demonstrates how cloud complexity was translated into a small user workflow.
6. **The upload-first branch** — explicitly as an in-progress architectural evolution, not a shipped feature.

---

## What this case study is meant to demonstrate

Weekend Render is supporting evidence for a different part of my product-engineering profile than Planning Coach.

It shows that I can:

- enter an unfamiliar technical domain and identify the questions that actually matter;
- build a POC whose tests can falsify the architecture;
- work directly with infrastructure rather than delegating every technical unknown;
- distinguish configuration from proof;
- change architecture when real-system evidence makes an earlier idea unnecessary;
- make cost, reliability, recovery, and user experience part of the same product model;
- use AI coding agents to accelerate investigation without outsourcing the product decisions.

The most important artifact is not the render farm itself.

It is the sequence from **unknown → hypothesis → live test → failure or evidence → product decision → next architecture**.
