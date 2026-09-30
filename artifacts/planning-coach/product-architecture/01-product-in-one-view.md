# 01 — Product in one view

Planning Coach can be understood as five product layers.

~~~mermaid
flowchart TB
    S["SHELL<br/>reach · host · leave · return · restore"]
    D["DURABLE PLANNING HOMES<br/>Board · Plans · Work Blocks · Tasks · Dates · Commitments"]
    C["CONTEXT & SOURCES<br/>Semester / course state · Email · documents · external facts"]
    L["COACHING / INTERPRETATION LIFECYCLE<br/>observations · conditions · opportunities · strategy"]
    P["PROJECTIONS & BRIDGES<br/>Feed · Check-in · Needs Attention · routines · Discord · SMS"]

    S --> D
    S --> C
    S --> P
    C --> L
    D --> L
    L --> P
    D --> P
    C --> P
~~~

The diagram is intentionally about **decision ownership**, not implementation topology.

## 1. Shell

The Shell owns how a student:

- reaches a capability;
- hosts it;
- leaves it;
- returns to the previous context;
- restores focus and state.

The Shell does not own the content or domain semantics inside the capability.

A useful rule is:

> **The Shell owns reaching and hosting a capability. The capability owns what happens after entry.**

## 2. Durable planning homes

These are the objects that represent decisions the student has actually made.

Examples include:

- Board placement;
- Plans and plan requirements;
- Work Blocks;
- Tasks and Follow-ups;
- Important Dates;
- Commitments.

These capabilities own the durable state and the mutations that change it.

A projection may display these objects, but it does not become their second home.

## 3. Context and sources

These represent what the outside world says.

Examples include:

- semester/course setup;
- class schedules;
- email;
- documents and attachments;
- source-derived facts.

Sources provide evidence.

They do not get to decide what the student should commit to.

## 4. Coaching / interpretation lifecycle

This layer can reason over source and planning state.

It may produce:

- observations;
- candidate conditions;
- opportunities;
- strategy-related implications;
- delivery eligibility.

The key boundary is that **interpretation is not automatically a durable planning decision**.

## 5. Projections and bridges

These provide bounded views or delivery surfaces over owner state.

Examples include:

- Feed;
- Check-in;
- Needs Attention;
- routines;
- Discord;
- SMS/digest.

They answer questions like:

- What should be surfaced now?
- What context is needed here?
- Can an authorized action be invoked in this surface?
- When must the student be routed back to the owning capability?

They should not silently create a parallel object model.

## Why five layers instead of “the assistant”

If everything is treated as one AI assistant, authority tends to blur.

For example:

~~~text
email says something
→ model interprets it
→ UI shows it
→ suddenly it behaves like a commitment
~~~

The layered architecture forces separate questions:

~~~text
What did the source actually say?
What did the model infer?
What is worth surfacing?
What did the student decide?
Which capability owns the resulting object?
~~~

That separation is the core of the product architecture.
