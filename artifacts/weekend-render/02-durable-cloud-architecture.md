# 02 — Durable cloud architecture

The architecture followed from one product requirement:

> **After durable acceptance, the user should be able to close Blender without endangering the render.**

That requirement determines where authority must live.

## Product architecture

~~~mermaid
flowchart LR
    B["Blender add-on<br/>submit · monitor · download"] --> R["Railway controller<br/>durable workflow authority"]
    R --> O["Object storage<br/>durable source + outputs"]
    R --> M["Flamenco Manager<br/>farm/job authority"]
    M --> W["GPU worker(s)<br/>Blender / Cycles"]
    W --> V["Farm storage<br/>working files / frames"]
    R --> N["Notification / preview surface"]
    R --> B
~~~

## Blender is a client

The add-on is responsible for the user's local interaction:

- choosing a render source;
- submitting;
- displaying state;
- receiving decisions/prompts;
- downloading results;
- reconstructing useful state after reopening.

It should not be responsible for keeping the cloud workflow alive.

If Blender crashes, sleeps, loses Wi-Fi, or is closed deliberately, the workflow should still have an authoritative owner.

## Railway owns the durable workflow

Railway is the coordinator for product-level state such as:

- workflow identity;
- admission;
- farm lifecycle;
- job association;
- estimate state;
- continuation decision;
- budget/cost state;
- expected outputs;
- retrieval state;
- cleanup obligations;
- client-visible status.

This is different from Flamenco's responsibility.

## Flamenco owns farm execution

Flamenco owns render-farm semantics:

- job/task scheduling;
- worker assignment;
- task state;
- Blender execution;
- farm progress.

Railway reads/reconciles that truth; it should not reinvent the scheduler.

## Object storage owns durable transfer state

The architecture increasingly moved source/output durability into object storage.

That lets the product separate:

- “the source is safely accepted”
from
- “a GPU is currently available.”

This is particularly important when GPU inventory fluctuates.

## Working farm storage is disposable

Farm-local storage is useful for:

- Manager state;
- Shaman/BAT checkout;
- current render output;
- worker-shared working state.

But it should not be the only durable copy of anything the user needs after teardown.

The teardown question becomes:

> **Has the product secured the only valuable copy elsewhere?**

not merely:

> **Did the render finish?**

## Failure recovery is a normal state

The architecture assumes:

- a worker may disappear;
- GPU creation may fail;
- provider capacity may be absent;
- an SSH/control connection may drop;
- output transfer may be interrupted;
- cleanup may fail and need later reconciliation.

Durable state exists so recovery does not depend on one long-running process remaining healthy.

## Product implication

The infrastructure exists to make the user workflow smaller:

~~~text
choose file
→ submit
→ safe to close Blender
→ receive decision only if needed
→ later receive/download verified output
~~~

The architecture is successful when most of the farm complexity disappears from the user's experience.
