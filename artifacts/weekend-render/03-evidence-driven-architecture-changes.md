# 03 — Evidence-driven architecture changes

Weekend Render changed architecture several times as experiments removed the need for earlier assumptions.

The important point is not that the final design was obvious.

It was not.

## 1. Remote render → durable cloud workflow

### Initial framing

The problem first looked like:

> Connect Blender to a remote Flamenco farm.

### Evidence/product pressure

A successful remote connection still left the local application too important.

The desired behavior became:

> Submit and leave. Blender can close.

### Architecture consequence

Workflow authority moved toward a durable Railway controller rather than the add-on/tunnel.

---

## 2. Optional estimation → estimation as the normal workflow

Cloud speed is useful only if cost remains understandable.

The architecture adopted an estimate-first flow:

~~~text
representative sample
→ measured runtime
→ projected remaining cost/time
→ budget + continuation decision
→ full render
~~~

The service-owned budget and user continuation threshold became separate concepts.

This turned cost control into product behavior rather than an after-the-fact billing concern.

---

## 3. MQTT broker → evidence-based simplification

An early architecture included MQTT for timely render events and progressive retrieval.

That looked clean on paper.

A later spike tested whether the product actually needed that broker.

### What the spike showed

Webhook hints plus reconciliation worked.

Polling alone was also sufficient, though slower.

The spike additionally found several real concurrency/retry defects that the architecture document could not have predicted.

### Product/architecture consequence

MQTT was removed from the required path.

The design shifted toward Railway reconciling against Flamenco Manager truth rather than depending on a separate message broker.

The lesson was not “polling is always better.”

It was:

> **Do not carry an infrastructure component merely because it makes the system look more event-driven.**

---

## 4. Per-output webhook hints → one registration event + polling

The webhook spike exposed a race: notification could arrive just before Flamenco had committed the task state being queried.

That was manageable with retry logic, but the owner reconsidered what events were actually required.

The architecture simplified again:

~~~text
job begins
→ one durable registration step
→ Railway now knows the Flamenco job identity
→ polling/reconciliation owns everything after that
~~~

The registration step closes the dangerous orphan window: paid render work should not start before the durable controller knows which job belongs to the workflow.

Everything after registration can be reconciled from Manager state.

This direction is represented in open architecture/implementation work rather than the original merged architecture document.

---

## 5. Farm-first source transfer → upload-first acceptance

A later production attempt exposed a different product problem: GPU availability.

A desired GPU could be unavailable for several minutes.

If the source upload begins only after farm startup, the user must keep Blender open while the provider searches for capacity.

That violated the stronger UX goal.

### Revised direction

~~~text
Blender
  ↓
signed source upload
  ↓
durable object storage
  ↓
Railway verifies size + SHA-256
  ↓
receipt: safe to close Blender
  ↓
wait for GPU capacity
  ↓
farm stages accepted source
  ↓
render
~~~

Now “safe to close Blender” depends on **durable source acceptance**, not GPU availability.

## 6. Hard-coded GPU → capacity-aware selection

The same capacity event weakened the assumption that one GPU model should be hard-coded.

The active plan expanded the candidate set and introduced live qualification before a new GPU type becomes eligible.

A later direction also considers creating farm storage where capacity exists rather than locking the product to one pre-created volume/location.

That work remains active, not shipped.

## Architecture timeline

~~~text
remote Flamenco connection
        ↓
durable Railway-owned workflow
        ↓
mandatory estimation + budget model
        ↓
MQTT event architecture
        ↓
webhook hints + Manager polling spike
        ↓
one registration event + polling
        ↓
upload-first durable acceptance
        ↓
capacity-aware GPU / storage placement
~~~

## What this demonstrates

The project did not treat architecture as a document to defend.

Each architecture revision answered a new piece of evidence:

- a product requirement became stronger;
- a component proved unnecessary;
- a race appeared under real timing;
- provider inventory invalidated a UX assumption;
- a simpler ownership model became possible.

That is the value of the history.
