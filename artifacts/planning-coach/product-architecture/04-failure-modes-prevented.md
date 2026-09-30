# 04 — Failure modes this architecture prevents

Capability ownership can sound abstract until the failure modes are made concrete.

## Failure mode 1 — Email becomes a second task system

### Tempting implementation

Email identifies an obligation and stores its own “task.”

### Result

Now Email and Tasks can disagree about:

- completion;
- due date;
- priority;
- provenance;
- deletion.

### Architecture response

Email records reading/decision state and hands explicit creation to the Task/Follow-up owner.

---

## Failure mode 2 — every surface owns its own “handled” state

### Tempting implementation

Feed, Check-in, Discord, and Needs Attention each mark an item handled locally.

### Result

The student sees different truth depending on where they look.

### Architecture response

The durable owner records the state transition. Projections reread it.

---

## Failure mode 3 — the LLM creates obligations

### Tempting implementation

A model says “this looks required,” so the product creates a commitment.

### Result

Inference has silently become authority.

### Architecture response

The model may propose semantic meaning. Durable state still requires an authorized student decision and owner-capability write.

---

## Failure mode 4 — setup completeness blocks ordinary use

### Tempting implementation

The course profile or syllabus is incomplete, so the system prevents Board planning.

### Result

A context source becomes a gatekeeper for the student's own planning.

### Architecture response

Setup supplies context. It does not own permission to plan.

---

## Failure mode 5 — a new channel weakens an existing capability

### Tempting implementation

Discord almost looks like Check-in, so add exceptions to Check-in until Discord fits.

### Result

Check-in loses its composition-only identity and acquires channel-specific action rules.

### Architecture response

Discord becomes a separate capability with a shared visit seam.

---

## Failure mode 6 — a projection becomes a parallel workflow engine

### Tempting implementation

Needs Attention or Feed starts managing its own lifecycle because it is convenient for the UI.

### Result

Projection state becomes more durable than the objects it was supposed to summarize.

### Architecture response

Projection state is bounded to presentation/disposition needs; domain resolution remains in the owning capability.

## Why this matters for a small team using AI coding agents

AI agents are very good at producing locally coherent implementations.

They are less naturally constrained by invisible cross-system ownership assumptions unless those assumptions are explicit.

A capability architecture gives implementation agents a question to ask before writing code:

> **Who owns this state and this mutation?**

That turns a product principle into an engineering decision rule.
