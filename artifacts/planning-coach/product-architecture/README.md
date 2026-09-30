# Planning Coach — Product architecture and capability ownership

Planning Coach grew from a collection of useful features into a system with explicit **capability ownership**.

The core architecture question became:

> Which part of the product owns each decision, each durable object, and each transition — and which surfaces are only allowed to project or route that owner state?

The private repository maintains a large product-architecture register. This public package distills the load-bearing structure rather than copying the full internal document set.

## Artifacts

| Artifact | What it demonstrates |
|---|---|
| [01 — Product in one view](01-product-in-one-view.md) | The five-layer product model and where major capabilities fit |
| [02 — Three architecture invariants](02-three-architecture-invariants.md) | The rules that prevent sources, projections, and AI interpretation from silently becoming product authority |
| [03 — Capability seam examples](03-capability-seam-examples.md) | Concrete examples of Email, Check-in, Feed, Discord, Board, and Planning interacting without duplicating ownership |
| [04 — Failure modes this architecture prevents](04-failure-modes-prevented.md) | Why capability ownership matters in practice |

## Product architecture, not deployment topology

These layers do **not** describe microservices or infrastructure.

They describe **who owns which product decision**.

A capability may be implemented across several modules, jobs, routes, or services. Conversely, several UI surfaces may read the same owner state.

The product architecture is concerned with whether those surfaces are allowed to:

- create durable state;
- mutate an owner object;
- interpret evidence;
- project current state;
- host a bounded action;
- route the student elsewhere.

## Historical note

The internal architecture register evolved over time as capabilities such as Check-in, Feed, Discord, Events, and richer Planning behavior were added.

The layer model and ownership invariants remained the stable part. This public artifact therefore uses the current conceptual structure rather than reproducing one dated capability table verbatim.

## Private-source evidence

For technical review, the private repository can show:

- the maintained Product Architecture and Capability Map;
- the Product Interaction Model;
- capability contracts and amendments;
- ownership rules in docs/rules.yaml;
- implementation PRs where architecture boundaries were corrected rather than weakened.
