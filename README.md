# Product Engineering

I am a technical product leader who works at the boundary between **product discovery, system design, and implementation**. My recent work has focused on using AI-native development tools to take ambiguous product problems through research, architecture, working software, testing, and iteration.

This repository contains case studies from products I have built with AI coding agents. The source repositories remain private because they contain active product work and, in some cases, privacy-sensitive development context. I can provide private source access for technical review.

## How I work

My role in these projects is not "prompt the model and accept the output." I own the product decisions, architecture, acceptance criteria, and release boundaries. I use tools such as Claude Code as implementation partners inside a deliberately constrained workflow:

1. **Understand the real workflow** — users, operators, constraints, policy, and failure modes.
2. **Decide what the product should own** — and just as importantly, what it should not own.
3. **Turn decisions into build authority** — contracts, journeys, wireframes, technical boundaries, and implementation plans.
4. **Build in small, testable increments** — with explicit interfaces and rollback boundaries.
5. **Use independent review** — architecture, correctness, integration, privacy/principles, and design fidelity are separate checks rather than maker self-certification.
6. **Change the design when evidence disagrees with the plan.**

This lets me work at product-manager altitude without being limited to specifications and tickets. I can investigate an unfamiliar technical question, prototype it, build the first version, and create enough engineering structure for the work to remain maintainable.

## Case studies

### [Planning Coach](case-studies/planning-coach.md) — primary case study

An AI-assisted planning product for college students, developed through a supervised real-user pilot.

Planning Coach is the strongest example of how I approach product engineering because the difficult parts were not simply UI or backend implementation. The product had to reconcile user agency, privacy, connected email and documents, LLM interpretation, planning state, constrained external interfaces, and the risk of an AI system silently turning uncertain information into obligations.

Supporting artifacts: [Discord design and implementation trail](artifacts/planning-coach/discord/README.md) · [Design-to-code loop](artifacts/planning-coach/design-to-code-loop/README.md) · [Product architecture](artifacts/planning-coach/product-architecture/README.md)

The case study covers:

- product discovery and scope evolution;
- translating privacy/regulatory research into product behavior;
- designing LLM features with bounded authority and deterministic verification;
- constrained interfaces such as Discord and SMS;
- a cross-model design-to-code process spanning GPT, Claude Design, and Claude Code;
- FastAPI/PostgreSQL/React implementation and Railway deployment;
- custom AI-agent skills and a multi-agent review process;
- turning product principles into executable engineering governance.

### [Weekend Render](case-studies/weekend-render.md) — supporting case study

A cloud rendering workflow for Blender built around an on-demand Flamenco farm, RunPod GPUs, Railway, object storage, secure SSH transport, and a Blender add-on.

Its strongest portfolio value is **technical discovery**: testing unfamiliar infrastructure against real components, rejecting assumptions that did not survive the POC, and evolving from "remote render" toward a durable cloud workflow that can continue after the local Blender process closes.

The case study focuses on rapid learning in unfamiliar infrastructure, evidence-driven architecture changes, real-cloud validation, and designing cost/reliability into the product rather than treating them as operations details.

### [Terra Firma Shop](case-studies/terra-firma-shop.md) — supporting case study

A programmatic map-art product spanning geospatial data, rendering, AI-assisted visual production, e-commerce, Shopify, mobile storefront QA, and an agentic production workflow.

Its strongest portfolio value is **breadth and autonomous product execution**: commercial research, product decisions, visual-system iteration, deterministic rendering, AI-assisted workflows, automation, and customer-facing QA.

The case study focuses on owning a product across business strategy, production engineering, AI-assisted creative work, storefront implementation, and launch operations.

## Technical range

Across these projects I have worked directly with:

- Python, FastAPI, SQLAlchemy, PostgreSQL, Alembic
- React, TypeScript, Vite
- Anthropic/LLM APIs and structured-output validation
- JMAP email integration and document/OCR pipelines
- Discord interactions and constrained external delivery surfaces
- Railway, RunPod, R2/object storage, SSH/Paramiko
- Blender, Flamenco, Shaman
- GeoPandas, Shapely, OpenStreetMap-derived data, image-processing pipelines
- Shopify and Playwright-based storefront QA
- CI, contract tests, migrations, integration tests, synthetic evaluation corpora
- Claude Code skills, multi-agent implementation, and independent review workflows

## Source access

The production repositories are private. That is intentional:

- some projects are still active products;
- Planning Coach was developed around a real-user pilot with strict privacy boundaries;
- private repositories preserve the full development and decision history without turning that history into public user data.

For a serious technical review, I can provide time-bounded access to the relevant source repository and walk through the architecture, implementation history, tests, and key product decisions.
