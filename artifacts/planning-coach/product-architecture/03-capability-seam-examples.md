# 03 — Capability seam examples

The architecture becomes clearer through concrete handoffs.

## Email → durable planning object

Email owns reading and deciding about the message.

It does not own the resulting Date, Commitment, or Follow-up.

~~~mermaid
flowchart LR
    E["Email source"] --> N["Noticing / evidence"]
    N --> D["Student decision"]
    D --> A["Email action adapter"]
    A --> O["Owning capability<br/>Date / Commitment / Follow-up"]
~~~

The adapter is a handoff, not a transfer of ownership to Email.

This prevents Email from becoming a second task/planning system.

---

## Feed → owner expression

Feed is a host for compact expressions of other capabilities.

~~~text
Email owner state ─────┐
Planning owner state ──┼→ Feed expressions
Event owner state ─────┘
~~~

A Feed card is not a new durable “Feed object” representing the same decision.

When the underlying owner changes, the Feed expression reconciles from that state.

---

## Check-in → orientation and routing

Check-in was designed around composition and reconciliation.

It can say:

> “This needs attention.”

But its architectural identity is that it does not become a second general action owner.

~~~text
owner state
   ↓
Check-in composition
   ↓
bounded orientation
   ↓
route to owner action
~~~

This became important when Discord was initially modeled as another Check-in expression.

Discord needed some in-channel actions. Rather than widening Check-in until it owned those actions too, Discord became a separate capability.

---

## Discord → bounded external action surface

Discord shares relevant visit/context state but has its own external trust boundary.

~~~text
owner state
   ↓
Discord projection
   ↓
consent/disclosure gate
   ↓
bounded external action
   ↓
owner capability
~~~

Discord can host a deliberately permitted bounded action without owning the underlying Email, Board, or Planning object.

---

## Semester Setup → Board

Semester Setup owns semester/course source state.

It does not gate whether the student is allowed to use the Board.

That distinction prevents setup completeness from turning into an artificial product lock.

~~~text
Course/setup state ──→ useful context for Board
Student Board action ─→ still allowed independently
~~~

---

## Planning → Board placement

Planning can decide what work structure is proposed.

Board owns occupancy, placement, contention, and application.

So a planner does not silently “own the calendar” merely because it proposed a Work Block.

~~~text
Planning proposes structure
        ↓
student accepts / continues
        ↓
Board applies placement
~~~

This seam keeps planning meaning separate from scheduling truth.

## The pattern

Across capabilities, the handoff is usually some form of:

~~~text
OWNER A supplies evidence or authorized proposal
                 ↓
student interaction / explicit boundary
                 ↓
OWNER B performs the durable mutation
~~~

The architecture is less about preventing capabilities from collaborating than about making the collaboration explicit.
