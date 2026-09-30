# 02 — API evidence and gap analysis

A central rule in the Planning Coach design process was:

> **Design does not get to imagine the backend, and Code does not get to redefine the interaction because the current backend is inconvenient.**

That required evidence moving in both directions.

## Code → Design: repository truth

Claude Code inspected the real repository and reported:

- endpoints / client calls that actually exist;
- exact request and response shapes;
- current mutations;
- loading / empty / failure / stale / conflict behavior;
- current adapters and types;
- fields the API exposes but the UI is not authorized to use;
- product-required behavior that the API cannot yet support.

The later formalized process calls this the **API evidence gate**.

Design fixtures must be API-shaped. They may normalize through an adapter, but they may not silently invent an endpoint, mutation, durable field, status, or capability.

## Design → Code: gap analysis

Claude Design compared the intended interaction with the repository evidence.

For Email Reading Surface v2, the design package explicitly tracked gaps involving things such as:

- section/body support;
- source spans;
- link inventory;
- file text/HTML availability;
- required-finding reason enforcement;
- sender display information;
- deferred return information;
- noticing-scoped decisions;
- searchable reference candidates.

Each gap had to be named.

## Three honest outcomes

```text
required by accepted interaction?
        │
        ├─ no → omit from this slice
        │
        ├─ yes, API exists → wire it
        │
        └─ yes, API absent → build/review backend capability first
```

What should not happen is a front-end state that implies a capability exists when it does not.

## The loop corrected both sides

During the Email v2 fidelity pass:

- Design believed a file-text capability was missing; Code found the route already existed. Design accepted the correction and updated the package.
- Design believed a selection evidence span could travel with an action; Code showed the real adapters rejected that field. It became a backend ask rather than client-side fiction.

So neither Design nor Code was treated as infallible.

## Why this handoff matters

The exchange is not “backend says no.”

It is a two-way contract:

**Code → Design:** this is what the application actually serves.  
**Design → Code:** this is the smallest missing capability needed to make the accepted interaction true.

Planning Coach later formalized this rule: if the API cannot support a required state, record the gap and either omit it honestly or implement the missing capability first.
