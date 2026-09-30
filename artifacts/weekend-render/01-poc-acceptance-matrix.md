# 01 — POC acceptance matrix

The first substantial Weekend Render artifact was not a UI.

It was an acceptance matrix for the assumptions most likely to invalidate the product.

The private POC closed every defined acceptance case, but the public artifact below shows a representative subset.

## Representative gates

| Question | Result | Why it mattered |
|---|---|---|
| Can the Manager survive control-host replacement? | **PASS** | Durable farm state could not depend on one disposable control container |
| Can the authoring machine reach the Manager securely without exposing it publicly? | **PASS** | The product needed remote submission without turning Flamenco into an internet-facing service |
| Can the GPU worker join the same farm and shared storage? | **PASS** | Control and render workers had to see the same job/assets/output state |
| Does Cycles really execute on the GPU? | **FAIL → PASS** | The first render silently used CPU; the gate caught a false success |
| Can a real project arrive with external dependencies intact? | **PASS** | A farm that renders only packed toy scenes is not the intended product |
| Can the submission host disconnect after accepted submission? | **PASS** | Central product requirement: local Blender/network presence should not own the workflow |
| Can the job finish while submission/operator connections are absent? | **PASS** | Proved execution was truly cloud-owned rather than being kept alive by a tunnel |
| Does worker loss preserve completed work? | **PASS** | Cloud GPU failure must be recoverable without losing already-finished frames |
| Can a replacement worker finish only the remaining work? | **PASS** | Failure recovery needed to be automatic and cost-aware |
| Can output be retrieved and checksum-verified? | **PASS** | Render completion is not useful unless the product can prove delivery integrity |
| Is cloud performance/cost measurable rather than assumed? | **PASS** | Product decisions needed real timing and billing evidence |

## The most important failure: “GPU render” that was actually CPU

The first Cycles render appeared to succeed.

The acceptance gate checked the actual device path and found:

~~~text
compute_device_type = NONE
~~~

The job had silently fallen back to CPU.

The configuration was corrected and OptiX execution was then verified from the render log.

That failure mattered more than a clean first-run success because it demonstrated that the POC gates could catch a **plausible false positive**.

## Disconnect as a product requirement

Two gates were treated as central exit criteria:

1. the submission host can disconnect after the farm has accepted the job;
2. the job can complete with neither the submission connection nor an operator connection keeping it alive.

Both passed.

This established the architectural direction that later became:

> **Blender is a client of the workflow, not the workflow host.**

## Worker-loss test

A GPU worker was intentionally removed during rendering.

The observed behavior:

- completed outputs remained intact;
- the job stayed recoverable;
- a replacement worker joined;
- the interrupted/remaining work continued;
- completed work was not unnecessarily redone.

This is the kind of fault that is easy to describe in an architecture document and much more valuable to prove on the real system.

## Performance evidence

On the measured scene, the cloud RTX 4090 rendered at roughly **11.7× the per-frame speed** of the local GTX 1660 test machine.

That number is not generalized as a universal Blender speedup. It is evidence for one measured workload and hardware comparison.

The important product consequence was that cloud rendering could create enough time value to justify the orchestration complexity for occasional heavy jobs.

## What the public artifact omits

The private POC contains many more cases, detailed environment identifiers, sample-project dependency records, raw hashes, provider resource details, and experiment logs.

Those remain private because the portfolio only needs enough evidence to make the method inspectable.
