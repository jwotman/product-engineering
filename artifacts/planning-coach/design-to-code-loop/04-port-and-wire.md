# 04 — Port and wire

Once the component was accepted, Claude Code's job was integration, not redesign.

## Code's responsibilities

The standing process eventually formalized the port discipline:

- preserve the accepted hierarchy and interaction model;
- adapt to real application tokens, shared components, routes, and client conventions;
- replace fixtures with the verified API/client seam;
- keep shape transformations in named/tested adapters;
- wire every displayed action to a real authorized mutation or omit it;
- preserve required draft state across failure;
- add honest loading/stale/error/degraded behavior;
- preserve mobile/desktop semantic parity;
- preserve stable test identifiers through the port.

## What Code was not supposed to do

Code was explicitly not authorized to:

- simplify the interaction because another implementation was easier;
- substitute a generic pattern without design approval;
- invent controls;
- hide API gaps behind attractive dead controls;
- change visible behavior without recording the delta and returning it to Design.

## Divergence log

Real integration still creates differences.

A design component can meet:

- a repository convention;
- a token system;
- an API limitation;
- a browser/layout constraint;
- a product authority that the prototype misunderstood.

Those differences were recorded in a **divergence log** rather than normalized away.

Each material divergence could then be:

- accepted by Design;
- corrected in Code;
- corrected in the Design source;
- escalated to the product owner.

## Email Reading Surface v2 cutover

The Email v2 work was a replacement port, not a side-by-side prototype.

The merged implementation:

- ported the redesigned queue and reader;
- preserved required existing behaviors;
- added desktop/mobile states and tests;
- completed Design ↔ Code fidelity rounds;
- removed the superseded frontend during cutover so the repository returned to one Email surface.

## Implementation evidence

The merged PR reported:

- hundreds of frontend tests;
- typecheck and production build;
- Storybook build;
- the full backend suite;
- governance/documentation checks;
- Design fidelity review.

The important point is not the test count itself.

It is that **visual fidelity, interaction fidelity, API fidelity, and regression correctness were all different acceptance dimensions**.
