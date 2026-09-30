# Instructions for Claude Code — Email Reading Surface port

Read `README.md` (screens, tokens, behavior) and `GAP-ANALYSIS.md` (route coverage, ASK-1..7) first. The four contract/addendum `.md` files are binding; where anything here seems to conflict with them, the contracts win — stop and flag rather than improvise.

## How this collaboration works

Two agents, two roles, one loop. **Claude Design** (who produced this package) owns what the surfaces look like, how they behave, and contract conformance. **Claude Code** (you) owns the real codebase: wiring, tests, build integration, cutover. Neither edits the other's artifacts — you don't restyle the design, Design doesn't patch your port.

The loop, as run for Follow-ups and the wave-1–3 Email frontend:

1. **Design → Code (this package).** DCs as the behavioral reference, the adapter (`EmailReader.api.js`) as the wire mapping, gap analysis naming what can't wire yet, these instructions. The DCs are the spec — when a behavior question isn't answered by the README, open the DC in a browser and interact with it; its behavior is the intent.
2. **Code builds.** Port the components into the codebase's environment, wire per the adapter, write the tests below, build Storybook stories per screen/state. Where a `CAPS` flag is false, build the control anyway and gate it — the design lights up later with no rework. If you must diverge (a pattern the codebase forbids, a route behaving differently than documented), diverge minimally and record it; don't silently redesign.
3. **Code → Design (the fidelity pass).** Send back: Storybook screenshots of every story, the testid-annotated components, your divergence list, and any contract questions that came up. Screenshots are the medium — Design reviews rendered output, not your source.
4. **Design reviews and responds.** You'll get back a fidelity-pass response document (see `handoff/email-frontend/FIDELITY-PASS-RESPONSE.md` in the repo for what the last one looked like): accepted items, per-screen adjustments (usually token/spacing/copy corrections), and rulings on your questions — some answered directly, some escalated to the owner. If adjustments are substantial, Design re-cuts the affected DCs and sends a revised package.
5. **Iterate 3–4** until the response contains no adjustments. Small rounds are normal; two rounds is typical.
6. **Code cuts over.** Replace the old email frontend with the approved port in one change (details at the bottom). After cutover, the repo is the sole source of truth for the shipped surface; the design project keeps only the design source.

Ground rules for the back-and-forth:
- **Contract questions go to Design, not into code.** If a wire value or edge case forces an interpretation the contracts don't settle, ask in the fidelity pass rather than encoding a guess.
- **The backend asks (ASK-1..7) are Design's to negotiate** with the backend owner. Don't build interim server routes for them; the `CAPS` gating is the interim.
- **Testids are load-bearing.** Design's review and future syncs key off them; keep them through refactors and make sure they land on main (last round they didn't — see the repo's FIDELITY-PASS-RESPONSE.md).
- **Sync record.** After cutover, note the commit in your PR description; Design tracks the association in its `github.md` and will read the repo, not this package, on the next sync.

## What this is
A **replacement port**. The repo already has a merged Email frontend (waves 1–3: `Email.dc.html` package). You are recreating the redesigned surfaces in the app's real frontend environment, wired to the existing `/api/v1/email` routes, and cutting over. Do NOT drop surfaces the merged package has that these DCs don't show: outbound/reply handoff (E10), sender-policy controls, account connect/disconnect. Carry them forward under the new visual language.

## Build order
1. **Queue** (`Planning Coach - Email Queue v0.1.dc.html`)
   - `GET /summary` → badge + ingest-state banners. `count_is_complete=false` must never render as a plain zero — show the degraded state instead (BADGE-001).
   - `GET /queue/primary` → rows. Render `subject` per `subject_capture` (see adapter header notes: undecoded raw headers are never shown as the sender's words; absent/not_captured render "(no subject)").
   - Status chips from `review_status` via the adapter's `mapReviewStatus` — §F.9 vocabulary verbatim.
   - "Why this order?" uses per-row `routing_reason`; the list never re-sorts while open.
   - Quiet shelf = `GET /queue/ignored`. "Hide today" is fixture-only (ASK-7) — build the control, gate it off in live mode.
   - Failed-action card = `GET /outstanding-actions` + `POST /actions/{id}/retry`. Never counted in the badge.
2. **Reader, desktop** (`Planning Coach - Email Reader v0.1.dc.html`)
   - `GET /messages/{id}/reader` is a pure read — opening records nothing (REVIEW-001).
   - Body: render the `primary_representation`; respect `safe_to_render` absolutely (HTMLSAFE-001 — never raw source HTML). `primary_representation: "none"` gets the honest unavailable state, with Open original still offered (`original_path` exists in every state).
   - Sections: derive client-side from `html_sanitized` h1–h4 headings until ASK-1 lands. Sender's words verbatim as titles; heading-less message = one section, never invent divisions. (Semantic segmentation for a deterministically eligible long heading-less body is a separate, later-authorized capability — `Email Semantic Reading Structure Amendment v0.1` — and is not part of this port.)
   - Date highlights: **suppressed in live mode** (ASK-2). Keep the component; gate on `CAPS.dateHighlights`.
   - Links: live hrefs; destination popover shows domain only until the §RD.5.3 ruling (ASK-3). Link inventory client-derived.
   - Noticings: fetch ONLY on open via `POST .../noticings/activate`. The projection is already display-shaped — `statement` null ⇒ render quote-only (source_only), `stated_or_inferred` ⇒ the chip, `uncertainty`/`unsure_about` ⇒ plain words, never scores.
   - Decisions/actions: `POST .../decisions` then `POST /decisions/{id}/actions` with an `Idempotency-Key` header (mandatory). Get the action-type set from `GET /action-types` — never hardcode it.
   - Selection capture: selection travels as `payload.evidence` (`quoted_text`, `material_id`, offsets — the `NoticingPassage` span shape). Prefill labeled with its origin, fully editable.
   - "See the text I read": gated off (ASK-4) until a text-fetch route is confirmed.
3. **Backstop** — `POST .../backstop-check` on No action / finish. Order findings by `materiality` desc. Required findings (see adapter's `mapFinding.required`) must refuse a bare reject client-side; the recognized reason rides `student_note` until ASK-5. Finding actions go through `POST /backstop-findings/{id}/actions` (idempotency key again). Dismissal never finishes the message — review status comes back from `GET .../review`, don't compute it locally.
4. **Reader, mobile** — same wiring, the mobile DC's frame (sheets, sticky bars, ≥44px targets).

## Tests (minimum)
- Badge honesty: `count_is_complete=false` never renders a numeric zero.
- `subject_capture` all four values render correctly; `captured_undecoded` never displayed as decoded text.
- Reader open performs no writes (assert no POST fires on mount).
- Noticings fetch only on explicit open; nothing pre-fetched.
- Action create sends Idempotency-Key; replay (`Idempotency-Replayed`) doesn't duplicate UI state.
- Required backstop finding cannot be cleared without a reason; ordinary findings can.
- One action resolves only its own finding (§H.1) — the others stay pending.
- All five §C.6 ingest states are visually distinct screens.
- Failed action appears in the §F.10 home and never in the badge.

## Deliverables back to Claude Design
1. Storybook stories per screen/state: queue × 5 ingest states, reader (sections open/closed, link popover, selection bar, capture card), noticings open, backstop (multi-finding, required-reason branch, dismissed, all-resolved), file viewer (ready/pending), mobile sheets. Screenshots of each returned for the fidelity pass.
2. The ported components annotated with `data-testid`s (keep them in what you send back — last time the annotated DC didn't land on main; see FIDELITY-PASS-RESPONSE.md in the repo's email handoff).
3. A short list of any place you had to diverge from the DC and why.

## Cutover (after the fidelity pass round-trips)
Replace the wave-1–3 email frontend with the revised package, carry-forwards included; keep route wiring identical; remove the old components in the same change so there is one Email surface on main.
