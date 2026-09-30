# 06 — Real-device test and implementation pivot

## The field failure

Desktop testing suggested the interaction path worked.

Testing on one iPhone produced a different result.

The first recorded sample:

| Control | Desktop | iPhone |
|---|---:|---:|
| Interaction button | worked | **~1 of 8 presses landed** |
| String select | worked | **3 of 3** |
| Link button | worked | **every attempt** |
| Plain message delivery | worked | worked |

The failure was silent:

- no visible client error;
- no request at the Planning Coach endpoint;
- no server log line.

That immediately distinguished it from the usual "interaction failed" case, where a request actually reached the application.

## Hypothesis elimination

The investigation retained an elimination ledger rather than jumping to a single explanation.

It checked or bounded questions such as:

- message payload validity;
- component type;
- endpoint response behavior;
- acknowledgement timing;
- signature verification;
- service execution;
- user/namespace guards;
- desktop/mobile differences.

At the end of the first investigation, the honest conclusion was limited:

> the failure occurs before the Planning Coach endpoint receives the press; one-device scope and mechanism remain unresolved.

That finding was merged as documentation rather than being inflated into a service-code diagnosis.

## The controlled follow-up

A later trial isolated one configuration variable.

Using the **same production Discord application, same bot account, same phone, and same message**:

| Configuration | Receiving over | iPhone button presses landed |
|---|---|---:|
| Interactions Endpoint URL clear | gateway | **12 of 12** |
| Interactions Endpoint URL restored | HTTP endpoint | **1 of 4** |

A throwaway application with the endpoint clear also recorded **13 of 13**.

Select menus and link buttons remained reliable throughout.

The mechanism was still unknown.

The variable was nevertheless actionable.

## Decision

The owner decision recorded after the trial was:

> **Adopt `discord.py` as the foundation for the service's Discord communication.**

Two parts of that decision had different evidence bases:

### Receive path — evidenced

The successful trial used stock `discord.py` with gateway receipt.

That configuration had direct field evidence behind it.

### Outbound consolidation — product/architecture decision

Moving outbound Discord competence behind the same library was an owner decision about maintainability and one coherent Discord layer.

It was supported by the existing adapter protocols, which made the transport swappable without rewriting callers.

It was **not** forced by the receive-side experiment, and the record says so.

## Path not taken

The diagnostic gateway probe could have been generalized into a custom receiver.

That would avoid a new runtime dependency, but would make the product responsible for:

- gateway session management;
- reconnection;
- interaction modeling;
- lifecycle edge cases.

The successful library trial made that complexity hard to justify.

## Current status

The original iPhone investigation is merged evidence.

The later documentation PR recording the isolated-variable result and the `discord.py` adoption decision is still open at the time of this artifact.

Therefore:

- **the decision is real;**
- **the service migration should not be described as shipped yet.**

## Why this is useful portfolio evidence

This sequence demonstrates:

- testing on a real device rather than trusting desktop success;
- distinguishing client-side dispatch failure from backend failure;
- preserving uncertainty when mechanism is unknown;
- designing a controlled comparison;
- changing technical direction instead of defending bespoke code;
- preferring a battle-tested library when evidence supports it.

## Private-source evidence

- merged PR #687 — iOS component-dispatch investigation
- open PR #688 — isolated-variable follow-up and `discord.py` decision
