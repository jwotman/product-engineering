# 02 — Three architecture invariants

Three rules do most of the work in keeping Planning Coach coherent.

## 1. Sources produce evidence; they do not conclude

A source capability can report facts from its own domain.

For example, Email can identify:

- sender/source information;
- message content;
- a stated date;
- a model-proposed semantic observation.

But Email does not get to decide:

- that a Date must be created;
- that something is a Commitment;
- that a Follow-up now exists;
- that the Board should reserve time.

The same distinction applies to Semester Setup and other source systems.

~~~text
SOURCE FACT
   ↓
possible interpretation
   ↓
student-facing decision
   ↓
OWNER CAPABILITY mutation
~~~

This prevents “the model noticed it” from becoming equivalent to “the student agreed to it.”

---

## 2. Projections do not own the objects they display

A projection is allowed to make owner state easier to understand or act on.

It is not allowed to become a second owner.

For example:

- Feed can project an Email interaction;
- Check-in can summarize a Board or Planning issue;
- Needs Attention can surface an unresolved condition;
- a routine can orient the student to current owner state.

But completion, mutation, or durable resolution still belongs to the capability that owns the underlying object.

This avoids parallel truths such as:

~~~text
Board says task is open
Check-in says task is done
Feed says task is snoozed
~~~

Instead:

~~~text
OWNER STATE
   ↓
projection A
projection B
projection C
~~~

All projections reread the same owner truth.

---

## 3. Durable transitions require explicit student action

A source or model finding can become durable planning state only through an authorized student action.

This is the agency seam.

Examples:

- an Email date does not automatically become a Date;
- an inferred obligation does not automatically become a Commitment;
- a suggested Work Block does not silently occupy Board time;
- an Event candidate does not become scheduled time without the relevant student decision path.

The exact UI can vary, but the architectural rule remains:

> **Evidence may be surfaced automatically. Durable commitment is not.**

## Why this matters for AI systems

LLMs are good at making plausible interpretations.

That makes it especially important to distinguish:

- **semantic confidence** from product authority;
- **helpful suggestion** from durable decision;
- **surface convenience** from ownership.

These three invariants keep an AI feature useful without allowing it to quietly acquire more authority than the user granted it.
