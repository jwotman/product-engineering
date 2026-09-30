# Planning Coach

## Building an AI-assisted planning product around user agency, privacy, and real-world constraints

**Role:** Product / architecture owner and hands-on product engineer  
**Implementation model:** AI-native development using Claude Code and other agents, with explicit product authority, contracts, tests, and independent review  
**Stack:** FastAPI, SQLAlchemy, PostgreSQL, Alembic, React/TypeScript, Railway, Anthropic, JMAP, OCR/document extraction, Discord  
**Status:** Working product developed through a supervised real-user pilot; source repository is private

---

## The product problem

Planning systems often assume the hard problem is putting tasks on a calendar.

The harder problem I wanted to solve was different:

> How can a planning system help a student notice obligations, understand what matters, and make better planning decisions **without taking ownership of those decisions away from the student**?

That becomes substantially harder when the product also reads connected sources such as email and documents, uses an LLM to interpret them, and presents information through external channels such as Discord or SMS.

A useful system has to do more than extract dates. It has to distinguish:

- a fact from an inference;
- a suggestion from an obligation;
- source information from durable planning state;
- something the model noticed from something the student actually decided;
- a convenient external notification from a safe place to expose sensitive context.

Planning Coach became an exercise in building those distinctions into the product architecture rather than relying on good intentions in prompts.

---

## What I owned

I treated the project as both a product and an engineering system.

My responsibilities included:

- defining the product model and interaction principles;
- deciding capability boundaries and what each surface was allowed to own;
- translating product decisions into contracts, journeys, wireframes, and implementation plans;
- investigating privacy, security, and external-platform constraints;
- designing model-input and model-output boundaries;
- directing implementation through AI coding agents;
- reviewing architecture and integration decisions;
- establishing test and acceptance requirements;
- iterating product direction as trial constraints and implementation evidence changed what made sense.

The coding agents produced substantial implementation, but they worked inside product and technical boundaries I defined. I deliberately built a workflow where the agent that creates an implementation is not also allowed to be the sole authority that declares it correct.

---

## 1. From a broad planning application to a set of owned capabilities

The product began as a broad college-planning assistant. As it matured, I moved away from treating "the assistant" as one intelligent surface and toward a set of explicit product capabilities with clear ownership.

The resulting architecture separates five kinds of responsibility:

1. **Durable planning homes** — the student's Board, plans, work blocks, tasks, dates, and commitments.
2. **Context and sources** — email, documents, class material, and semester information.
3. **Coaching lifecycle** — observations, conditions, opportunities, delivery, and response.
4. **Projections** — views such as Check-in, Feed, Needs Attention, and routines that summarize owner state without becoming a second owner.
5. **Bridges to external surfaces** — bounded delivery through Discord or SMS.

A load-bearing rule is that **sources produce evidence; they do not create planning commitments**.

Another is that **projections do not own the objects they display**. A Check-in can surface a problem, but resolving it still happens through the capability that owns that problem.

This sounds architectural, but it is fundamentally a product decision. It prevents a convenient UI or an LLM from quietly acquiring authority the user never granted it.

### Why this mattered

It made later changes much safer.

When I added email understanding, the semantic system could produce structured observations without gaining authority to put something on the Board.

When I added Discord, I could decide whether Discord was merely another expression of Check-in or a separate capability by asking a product question: **does this surface own actions that Check-in explicitly does not?**

The answer was yes, so I changed the architecture rather than weakening Check-in's rules to make Discord fit.

That decision is recorded in the implementation history rather than hidden as cleanup.

---

## 2. Turning privacy and regulatory questions into product behavior

Planning Coach was developed around a real student workflow and potentially sensitive education-related information. I did not want "privacy" to exist only as a policy page.

I researched the product implications of FERPA, institutional policy, Discord platform policy, external disclosure, consent, and data minimization. I was careful not to treat that research as a legal conclusion or market the product as "FERPA compliant."

Instead, I translated the findings into product and engineering decisions.

### Examples

**External delivery is a separate disclosure decision.**

A detail that is appropriate inside an authenticated application is not automatically appropriate in Discord or SMS.

The system therefore distinguishes content categories and can decide among outcomes such as:

- detailed content allowed;
- minimized detail;
- pointer only;
- suppressed.

Highly sensitive categories remain restricted by default.

**Consent is represented as state, not assumed from configuration.**

For Discord, the student's own link action creates the authorization record. Unlinking withdraws it. A configured bot token does not mean the student consented to receive anything.

The outbound delivery service checks the live link **before content is composed**, so "no authorized recipient" means the message is not merely unsent — it is never assembled.

**Interactive controls do not expose internal identifiers.**

Discord actions use opaque, expiring context handles rather than embedding student, email, course, work-block, or observation IDs in component values.

**Logs are structurally constrained.**

Student/source text is not permitted in operational logs. The repository uses explicit structural fields and treats content-bearing material as a different storage tier.

**Model access is purpose-bounded.**

A semantic task gets the minimum source and context needed for its declared purpose. The model does not receive an entire mailbox or planning history simply because the application can technically access it.

### What this demonstrates

The relevant skill is not memorizing a particular regulation.

It is being able to take a messy question such as:

> "Can we make this workflow convenient without creating an unsafe or unauditable disclosure path?"

and turn the answer into interaction rules, data boundaries, architecture, and tests.

That is the kind of product work I expect to transfer to other regulated or high-consequence domains.

---

## 3. Building an LLM feature as a system, not a prompt

Email became one of the most technically interesting capabilities.

The product needed to understand long, multi-topic messages and determine whether anything in them was relevant to the student's planning context. But an LLM-generated interpretation could not be allowed to become product truth simply because the language sounded confident.

I designed the model platform around one governed call path with registered tasks, explicit schemas, bounded input envelopes, provider routing, cost controls, and deterministic validation.

### Example: contextual email review

One implemented workflow performs a once-daily contextual review of an email cohort.

The pipeline:

1. selects the bounded source cohort;
2. excludes classes of messages that should not enter the model path;
3. creates a durable pending run before a paid model call;
4. asks the model for structured observations;
5. validates those observations against closed schemas and deterministic rules;
6. consolidates related findings;
7. persists the result atomically;
8. exposes the result only through a read-only seam to downstream capabilities.

The model can propose semantic meaning. Deterministic code still verifies structure, ownership, admissibility, and lifecycle rules.

Retries, failures, supersession, and operator reruns are explicit states rather than hidden model behavior.

### A principle I kept returning to

> **The model may interpret evidence; it does not silently acquire domain authority.**

For example, model output cannot independently:

- create a commitment;
- create or move Board work;
- strengthen optional content into a requirement;
- contact another person;
- override a student's correction;
- resolve a product-authority conflict.

This separation makes the AI feature more useful, not less useful, because the rest of the product can trust what kind of artifact it is receiving.

---

## 4. Designing for constrained interfaces

A major product question became: **how much of Planning Coach should require the full web application?**

That led to SMS and then Discord work.

The useful design lesson was that a constrained channel should not be treated as a miniature copy of the main application.

Discord has different trust, display, identity, and interaction properties.

I therefore treated it as its own capability with explicit rules for:

- what information can be disclosed;
- how many interactions should appear at once;
- linking and revocation;
- signed inbound requests;
- identity binding;
- replay protection;
- stale-state reconciliation;
- structural logging;
- when an action must hand the user back to the authenticated application.

One architectural decision changed during implementation.

The first direction tried to treat Discord as another expression of Check-in. But Check-in's architectural identity was composition-only: it surfaced owner state and routed the student to the real action owner. Discord's value depended on supporting actions directly in the channel.

Instead of widening Check-in until the distinction no longer meant anything, I separated Discord into its own capability while allowing both surfaces to share the same underlying visit state.

That is an example of a pattern I value: **when a new feature forces several exceptions into a clean boundary, question the feature's placement before weakening the boundary.**

---

## 5. Product authority that an AI coding team can actually use

As the project grew, a normal collection of tickets and prose docs was not enough.

AI coding agents are fast, but they amplify ambiguity. If two documents disagree, an agent will often choose one and continue. If a product principle is merely aspirational, it can disappear several layers down in an implementation.

I built a governance model intended to make product authority machine-usable.

### The hierarchy

The repository distinguishes among:

- product contracts;
- journeys and acceptance references;
- technical architecture and API contracts;
- implementation plans;
- current code and tests;
- historical PR rationale.

The rule is simple: current code is primary evidence for what exists, while the appropriate authority document controls what it is supposed to do.

### Executable rules

Product principles are projected into a structured rule set with severities and scope.

Examples include:

- student/source content may not enter structural logs;
- real student data may not appear in committed fixtures or screenshots;
- write access requires explicit feature-level consent;
- failures must be visible and recoverable;
- the product must not invent missing facts;
- model calls must go through the registered model platform.

Generated, path-scoped Claude guidance is derived from that rule source. CI checks for drift.

This turns "please remember the privacy principles" into something closer to a build constraint.

---

## 6. A multi-agent review process instead of maker self-certification

I also created custom Claude Code skills for independent review.

For a substantial increment, implementation can be reviewed through separate lenses:

- **Integration review** — is the capability actually wired end to end, or merely implemented somewhere?
- **Architecture review** — does it preserve ownership, boundaries, and system invariants?
- **Correctness review** — do the gates and tests actually fail when the protected behavior is broken?
- **Principle review** — privacy, secrets, user agency, and governance.
- **Design-fidelity review** — when a UI surface has a governing design reference.

The maker does not adjudicate its own work.

Reviewers run independently at the exact PR head and post findings before an orchestrator ranks and reconciles them.

The Definition of Done is evidence-based: a capability is not considered complete merely because the implementation agent says it is complete.

### Why I built this

The bottleneck in agentic development quickly stops being typing code.

It becomes:

- preserving intent across several fast-moving changes;
- preventing a locally-correct implementation from breaking a system boundary;
- distinguishing "code exists" from "the product is actually wired";
- making sure tests verify the claim rather than restating the implementation;
- keeping privacy and product principles from disappearing under delivery pressure.

The review system was a product-engineering response to that bottleneck.

---

## 7. Engineering underneath the product work

Planning Coach is not only a documentation exercise.

The private repository contains a working application with:

- FastAPI backend;
- SQLAlchemy domain/store layers;
- PostgreSQL production database;
- Alembic migrations;
- React/TypeScript SPA;
- Railway deployment;
- authentication and operator boundaries;
- JMAP email ingestion;
- PDF/HTML extraction and OCR;
- model-provider abstraction;
- semantic email processing;
- planning, Board, class-session, work-block, routine, Feed, and event capabilities;
- Discord delivery and signed interaction ingress;
- extensive automated tests across domain logic, API contracts, migrations, semantic evaluation, privacy boundaries, model registration, governance, and UI behavior.

I use a strong bias toward narrow interfaces, idempotent writes, explicit state transitions, and synthetic test data.

---

## 8. What changed because evidence changed

One of the easiest ways to make a portfolio project look polished is to remove the wrong turns.

I think the wrong turns are more useful.

A few examples from Planning Coach:

### Discord stopped being "another Check-in surface"

Implementation pressure exposed that Discord needed action ownership that Check-in explicitly did not have. I separated the capabilities instead of weakening the original boundary.

### External disclosure moved from a blanket conservative posture to category-based policy

Early research took a pointer-only approach while the legal/policy posture was unresolved. Further analysis led to a more useful product target: deterministic category-based disclosure, detailed ordinary planning information where allowed, and stricter treatment of genuinely sensitive categories.

The conservative option remains a fallback rather than the whole user experience.

### The product increasingly separated durable owner state from projections

As more surfaces appeared, letting each surface maintain its own interpretation of "done," "important," or "handled" would have created divergence. The architecture moved toward projections that re-read owner state rather than becoming parallel workflow systems.

### The engineering process itself evolved

As the number of AI-generated changes increased, informal review stopped being sufficient. Product contracts, executable rules, independent reviewer roles, and exact-SHA review were added because the development method itself created new failure modes.

---

## 9. What I would show in a technical review

The full repository remains private, but for an interviewer or engineering review I would walk through a small number of artifacts rather than the entire history:

1. **Product architecture/capability map** — demonstrates ownership and seams.
2. **Trial privacy/data-governance policy** — shows how product risk became concrete data rules.
3. **Discord capability + implementation history** — a strong example of changing architecture when the original placement was wrong.
4. **Contextual email review implementation** — shows the governed LLM pipeline, persistence, deterministic validation, and tests.
5. **Agent orchestrator/reviewer skills** — shows how I use AI coding tools at team/process scale.
6. **Current application code and tests** — demonstrates that the case study corresponds to working software rather than a product-design exercise.

Private source access can be provided for technical review.

---

## What this case study is meant to demonstrate

Planning Coach is evidence that I can work across the boundary that is often split between product management and engineering:

- understand a user's actual workflow;
- research a domain constraint deeply enough to make a product decision;
- decide what belongs in the product and what does not;
- translate that decision into interfaces and system boundaries;
- build the first working implementation with AI-native tools;
- create tests and review processes that make the implementation trustworthy;
- change direction when real evidence invalidates the original approach.

That is the kind of product engineering work I want to continue doing.
