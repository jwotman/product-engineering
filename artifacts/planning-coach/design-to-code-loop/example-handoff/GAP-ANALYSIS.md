# Email Reading Surface — Frontend Gap Analysis v0.1

Read against `jwotman/planning-coach-v1@main` (2026-08-06): `routes_email.py`, `routes_email_review.py`, `routes_email_noticing.py`, `routes_email_actions.py`, `routes_email_backstop.py`, `routes_email_outbound.py`, `schemas_email*.py`. Companion to `EmailReader.api.js`, whose `CAPS` flags encode this table.

## What wires live today (no backend work)

| DC surface | Route(s) |
|---|---|
| Badge + §C.6 ingest states | `GET /summary` (`needs_decision_count`, `count_is_complete`, per-account connection/staleness) |
| Queue rows, status chips, "Why this order?" | `GET /queue/primary` (`review_status`, `routing_reason`, `subject_capture`, `file_count`) |
| Quiet shelf | `GET /queue/ignored` + promote via ordinary reader |
| Reader source (body, files, warnings) | `GET /messages/{id}/reader` — a pure read (REVIEW-001) |
| Decisions incl. No action, defer, Already handled | `POST .../decisions`, `POST .../defer`, `GET /already-handled-candidates` |
| Decide actions (Add a date etc.) | `POST /decisions/{id}/actions` + `Idempotency-Key`; registry from `GET /action-types` |
| What I noticed (fetch-on-open) | `POST .../noticings/activate` — the projection is already §D.3-shaped (quote, stated/inferred, uncertainty words, source_only) |
| Finalize backstop | `POST .../backstop-check`, finding decision, finding action (`origin=accepted_backstop_finding`) |
| Failed-action home + retry/cancel | `GET /outstanding-actions`, `POST /actions/{id}/retry\|cancel` |

The prototypes' language maps onto the wire with no invention: `stated` chip = `stated_or_inferred`, "their word" = a `stated` requirement noticing, panel order = `materiality`.

## Backend asks

**ASK-1 — Sectioned body projection.** No route names the sender's headings. *Interim:* client-derives sections from `html_sanitized` h1–h4 (source-structural, no model input — §RD.1.1-safe). *Ask:* a `sections` list (heading text + material offsets + per-section source-fact counts) on the reader projection, so plain-text-only messages and hostile HTML get server-consistent treatment (§RD.7.2). Semantic segmentation for heading-less mail beyond this client-derived interim is now owner-authorized under `Email Semantic Reading Structure Amendment v0.1` (2026-08-07), bounded and gated as specified there; it is a separate capability, not part of this ASK or this package.

**ASK-2 — Verbatim date-span projection.** §RD.3 wants precomputed highlight spans; `EmailReaderSource` is deliberately zero-model-derived (REVIEW-003, tested). These must be reconciled: either date spans are ruled *source-structural* (a regex-grade recognizer, no semantic pipeline) and join the reader projection, or they ship as a separate pre-activated projection with its own privacy ruling. **Until then live mode suppresses highlights; selection capture covers the flow (§RD.3.4).**

**ASK-3 — Link inventory.** No route carries the body's links. Anchor text + href domain are source facts (§RD.5.4); the plain-language characterization awaits the §RD.5.3 owner ruling. *Interim:* client-derive from `html_sanitized`; domain-only labels.

**ASK-4 — File text fetch.** ~~No route found~~ **Partially closed (fidelity pass v1):** `GET /api/v1/materials/{id}/text` exists and wires live. Remaining: honest-transcription framing copy on the wire ("some of this was hard to read") if the extraction status supports it.

**ASK-5 — Recognized-reason vocabulary for required findings.** `BackstopDecisionValue` = accepted/rejected/unsure/deferred; §H.4 requires a *recognized reason* to clear a required finding. *Interim:* reason rides `student_note` and the DC refuses bare rejects client-side — but the invariant belongs server-side.

**ASK-6 — Sender display name** *(cosmetic)*. Rows carry `sender_address` only; "Northreach Arts Collective" needs the display-name header captured at ingest.

**ASK-8 — Serve `html_sanitized`** *(from fidelity pass v1)*. The derivative exists server-side but no route returns its bytes; sectioned reader, link inventory, and inline-image placement all gate on it. `GET /api/v1/materials/{id}/html`.

**ASK-9 — Evidence span on the action wire** *(fidelity pass v1)*. Action adapters reject unknown payload keys, so a selection's span cannot travel with the action. §G.6 wants the span durable on the created object.

**ASK-10 — Passage on `BackstopFindingResponse`** *(fidelity pass v1)*. Findings carry `explanation` only; §I.5 wants the quoted passage on the card.

**ASK-11 — `returns_at` on deferred queue rows** *(fidelity pass v1)*. "handled for now · back Friday" needs the date on the row, not just on a fresh `DeferResponse`.

**ASK-12 — Noticing-scoped decision outcomes** *(fidelity pass v1, conditional)*. Keep visible / Not needed on a noticing = a `scope=noticing` Reading Decision; only an ask if the outcome vocabulary lacks these members.

**ASK-13 — Searchable reference-candidates route** *(owner decision 2026-08-06 #5)*. A real board holds hundreds of candidates; the reference picker is search-first. Needs: text query + kind filter over Dates/Commitments/Follow-ups, plus the three structural facts that seed the unprompted "Likely" shelf — created-from-this-message/thread provenance, dated within the coming weeks, recently touched. No model-derived relevance ranking.

**ASK-7 — Day-scoped shelf suppression.** "Hide today" (§C.4: suppresses for the day, returns to shelf) has no route; `POST /senders/ignore` is a *standing* policy — the wrong semantics. Fixture-only until a per-message suppression route exists.

## Port plan (the Follow-ups loop)

1. Claude Code wires the CAPS-true surfaces against the real routes, tests, Storybook screenshots back to Claude Design — including every §C.6 state and the backstop with a required finding.
2. Claude Design adjusts, returns the revised package.
3. Claude Code replaces the currently-merged Email frontend (`Email.dc.html` package, waves 1–3) and cuts over. This is a **replacement port** — the outbound/reply flow (E10) and sender-policy screens from the merged package must be carried forward, not dropped: the new reader adds surfaces, it does not remove those.
4. ASK-1..7 land; CAPS flip; highlights, link inventory, file text, and Hide today light up with no DC changes.
