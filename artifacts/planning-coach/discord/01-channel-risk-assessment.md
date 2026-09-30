# 01 — Channel and risk assessment

## The question

Planning Coach already had a richer authenticated web application. The question was not simply whether Discord had an API.

It was:

> Can a student receive enough context in Discord to understand and often act on a planning matter without turning an external social platform into a second, weakly governed Planning Coach?

The investigation covered technical feasibility, interaction density, identity, security, external disclosure, cost, platform policy, and the legal/institutional posture of education-related information.

## What the research found

### Technically, the channel was a good fit

A bot DM could support:

- direct student messages without joining an institutional server;
- message components for bounded actions;
- signed inbound interactions;
- message updates after an action;
- links back to the authenticated application or another authoritative system;
- low incremental delivery cost at pilot scale.

The hard part was not API capability.

The hard part was defining **what could safely and truthfully cross the boundary**.

### The main risks were product risks

The research identified four primary risk areas:

1. **External disclosure** — a detail appropriate in an authenticated app is not automatically appropriate on a lock screen or social messaging surface.
2. **Identity/action security** — a Discord account must not become generalized Planning Coach authentication.
3. **Platform/legal posture** — student authorization, education-record rules, platform policy, retention, and future institutional deployment are separate questions.
4. **Attention density** — a proactive channel can become harmful if it behaves like an overflow queue.

## Product decisions that followed

### Bounded density

The working product rule limited a message to a small number of interactions rather than draining every available item into Discord.

This was a product-attention rule, not a Discord API constraint.

### Stable identity, not display-name identity

The design used the stable Discord user ID as the external identity key rather than username or display name.

### Structured interaction before free text

The initial direction favored system-initiated messages and bounded structured responses. Free-form student commands were treated as a later capability with a higher burden of parsing, privacy, and ownership correctness.

### Deterministic disclosure policy

The initial research pass used a deliberately conservative pointer-only posture while policy was unresolved.

That was later superseded by a more useful product direction:

```text
ordinary planning facts
    → detailed or minimized delivery may be eligible

high-sensitivity/private categories
    → pointer-only or suppressed by default
```

A model could help classify content, but it would not be the final authority for whether a fact was disclosed externally.

## Why this is product engineering

The output of the research was not a compliance memo that sat beside the product.

It changed:

- the content model;
- identity and action handling;
- interaction density;
- logging rules;
- the rollout sequence;
- which controls belonged in Discord;
- when the system had to hand back to an authenticated owner surface.

## Important limitation

This work was explicitly **not** treated as a legal conclusion or a claim that the product was FERPA-compliant. Independent legal/security/privacy assessment remained a gate before generalized compliance claims or broader institutional deployment.

## Private-source evidence

- Discord technical/privacy/security research, 2026-08-24
- Attention & Interaction draft contract
- Discord Interaction draft contract
- later `DISCORD-001` / `DISCORD-002` rules and implementation history
