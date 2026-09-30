# Publication note

This directory is a **sanitized public copy of the actual Claude Design → Claude Code Email Reading Surface v2 handoff** from the private Planning Coach repository (August 2026).

The handoff mechanics, executable prototype structure, adapter code, gap analysis, implementation instructions, and fidelity-response content are retained. Publication edits are limited to removing or replacing real-world fixture identity/content:

- institution and organization names were replaced with synthetic names;
- institutional domains and addresses were replaced with reserved/example equivalents;
- named people in the demo newsletter were replaced with synthetic people;
- identifying housing/campus references were generalized;
- no student data, credentials, or real account identifiers are included.

The original package also contained governing contract/addendum documents and an exploratory wireframe file. Those are intentionally omitted here to keep the public artifact focused on the operational Design → Code handoff. They remain available in the private repository for technical review.

**Historical status:** Email Reading Surface v2 is presented here as the implementation that proved the design-first delivery method. The Email product continued to evolve afterward; this is process evidence, not current product authority.

To inspect the interactive references, keep `support.js` beside the `.dc.html` files and open a prototype in a browser.

---

# Handoff: Email Reading Surface (Reader · Mobile Reader · Queue)

## Overview
The email reading experience for Planning Coach: the queue (list of messages needing a decision), the full-surface reader (desktop and mobile), and the finalize backstop. Designed for a student whose primary challenge is attention/overwhelm — structure and progressive disclosure over a long undifferentiated scroll. This is the student's primary mail-reading surface.

Validated with the student 2026-08-05, no changes requested.

> **Feed expression ownership (2026-08-20).** Email supports Feed-hosted card expressions — the
> compact reading invitation (whose `Read email` contextually invokes this full reader, with
> required return to Feed) and the observation-decision expression. Both are **Email-owned**
> presentations of this component; Feed hosting does not transfer ownership of the expression or
> its interaction semantics. See `design/contracts/Feed Interaction Contract Card Expression
> Addendum v0.1.md` §1.1 and §4.

## About the Design Files
The `.dc.html` files in this bundle are **design references created in HTML** — working prototypes showing intended look and behavior, not production code to copy. The task is to **recreate these designs in the target codebase's existing environment** using its established patterns, wired to the real Email pipeline. Open each file directly in a browser (with `support.js` in the same folder) to interact with it.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interaction flows are final and should be recreated as shown. Copy text is contract-conformant language — reproduce it verbatim; the plain, non-accusatory tone is a requirement, not a placeholder.

## Governing documents (included)
Implementation MUST conform to these. Where a README detail and a contract rule seem to conflict, the contract wins.

- `Planning Coach - Email Interaction Contract v0.4.md` — the parent surface contract (§ references below).
- `Planning Coach - Email Attachment Reading Addendum v0.1.md` — file viewer, closed action set, select-a-passage.
- `Planning Coach - Email Reading Surface Addendum v0.1.md` — body rendering, date highlighting, selection-in-body, links. **Drafted from these prototypes**; the DCs are its reference behavior.
- `Planning Coach - Shell Hosting Precedence Amendment v0.1 (Email Reader Overlay).md` — the reader is a full-surface overlay at rank 3, NOT rail-hosted. Owner-decided 2026-08-05.

## Screens

### 1. Queue — `Planning Coach - Email Queue v0.1.dc.html`
Entry from the header email control (§B.1). Max-width 760px column on #07090c.

- **Rows** (§C.1–C.2): sender (14px/700 #eef1f6) + sender category and received time (11px #5f6b7a) · subject (12.5px #9aa6b4, ellipsized) · source-fact chips only (`3 files`, `sent only to you` — never "mentions a date"/"deadline"/"urgent"). Right-aligned status chip from §F.9 vocabulary: `waiting on you` (amber #eec288 on #15110a, border #6e5226), `partly decided` / `one thing to check` (violet #b3a3e0 on #120f1c, border #4a3f78).
- **"Why this order?"** disclosure (§C.3): plain-language explanation, order never re-sorts while reading.
- **Deferred row**: dimmed, `handled for now · back Friday`, no button.
- **Failed-action home** (§F.10): red card below the queue (`#1a0f12` bg, `#7a3b47` border, text #e6a3ae/#b07f88) — decision recorded, creation failed, `Try again`. Never counted in the badge.
- **Quiet shelf** (§C.4): collapsed disclosure `Quiet shelf · 2 · probably not for you — never counted, never nagging`. Rows have `Open it` (promote → full reader, ordinary rules) and `Hide today` (suppress for the day; returns to shelf, not queue).
- **Ingest states** (§C.6) — the `ingestState` prop demos all five; each is a DISTINCT screen: `normal` · `empty` (plain resting state: "Nothing needs a decision." + last checked; no celebration) · `stale` (amber banner: when mail was last checked, as fact) · `paused` (blue banner: system reading unavailable, messages still readable/decidable by hand, names what's missing: noticings, file text, highlighted dates) · `broken` (red banner: not being checked, nothing lost, Reconnect).
- **Badge** (§B.3): counts messages currently requiring a decision; zero is legitimate and unremarked.

### 2. Desktop reader — `Planning Coach - Email Reader v0.1.dc.html`
Full-surface overlay (NOT in the right rail — see the hosting amendment). Max-width 1120px card, two columns: body (flex 1) + persistent rail (272px, #0d1219, border-left #161d26).

- **Summary header**: subject 19px/700 · sender/time 12.5px · chips `3 files · 11 links · 5 sections · waiting on you` · actions right: `Aa · <size>` cycler, `Not now`, `Open original ↗`.
- **Sections**: body folds at the **sender's own headings** (never model-invented; a heading-less message is one section — for a deterministically eligible long heading-less body, see the later-adopted `Email Semantic Reading Structure Amendment v0.1`, out of scope for this package). Cards #0d1219, border #223046, radius 13px. Header row: mono caret ▸/▾ #7fb0e6 · title 14.5px/700 · source-fact counts 11.5px #5f6b7a. First section open by default (`sectionsDefault` prop). Body text #cdd5df, line-height from the size setting.
- **App typography re-render**: complete and verbatim — every word, image, link, footnote, in order. Sender styling (colors, fonts, layout tables, dividers) dropped. `Open original` covers fidelity (§RD.1.2).
- **Inline images**: in place as tappable placeholder cards (#0e1420, dashed-feel border #223046, mono filename) → open the file viewer. Signature logos/tracking pixels render as nothing.
- **Text size cycler**: Comfortable 14.5px/1.7 → Large 16.5px/1.75 → Spacious 18px/1.95. Persist per student.
- **Rail**: `Decide` (Add a date [primary tint], Add a commitment, Create a follow-up, Reply, No action, `More — already handled, that's not right…`) · `What I noticed` (violet card; content fetched ONLY on open — opening is the request, §E.7; each noticing: claim + `stated` chip + verbatim quote + Add a date / Keep visible / Not needed) · `Files · 3` (name + status: `Text is ready` #6bbd8f / `Still reading it — you can decide now` #c69a55) · `Links · 11` collapsed inventory (anchor text + destination, order of appearance, no ranking).
- **Links in body**: tinted #7fb0e6 on rgba(61,109,166,0.14), radius 4px. Tap → destination-first popover: anchor text · `Goes to: <plain-language destination>` · `Open ↗` / `Copy link` · "Opens in your browser — outside Planning Coach." (Until the "Goes to:" characterization ruling, show domain only — §RD.5.3.)
- **Date highlights** (§RD.3): verbatim date strings the pipeline resolved, tinted green #9fd4b5 on rgba(107,189,143,0.12) with dashed underline #4a8a66. Tap → capture card labelled **"Written in the email"**: quote · resolved value ("Sunday, August 23, 2026 · 5:00–6:00 PM") · `Yes — add this date ›`. Resolution is precomputed server-side, never inferred at tap time. Highlights are a convenience over selection, never a gate.
- **Selection capture** (§RD.4, §AR.1.4): selecting body text raises a floating chip bar (Add a date / Add a commitment / Create a follow-up / Use as a reference). Chosen action opens prefilled with the selection, labelled **"I read this as"** (interpretation) — distinct from highlight's "Written in the email". Unparseable date selection: say so plainly, open form with selection as starting note. Action with no selection: empty form, tip shown.
- **Finalize backstop** (§I): fires on `No action` with unresolved material findings. Panel top-right over the reader (body stays visible), #120f1c/#4a3f78 violet. Header "Before this is done" + "Your choice stands either way. I noticed N possible actions — possible actions, not corrections." One card per finding, most consequential first. Required finding ("A meeting the sender calls mandatory", `their word` chip) cannot be cleared by Not needed — `Rule it out ▾` opens the reason branch: Already handled / Doesn't apply to me / That's not right (§H.4). Ordinary findings: Add it / Keep visible / Not needed. Dismissing (`Not now` / ✕) keeps the decision but sets status `one thing to check` / `N things to check` — dismissal never finishes the message (§I.7). Resolving the last finding → status `done`, toast "That was the last one — this message is done." A ruled-out finding never returns (§I.9). One action resolves only its own finding (§H.1).
- **File viewer** (Attachment Addendum): modal — image area · `See the text I read` toggle (verbatim extracted text + honesty note "Some of this was hard to read…") · pending state ("Still reading this one. You can decide about the message now") · `Open original ↗` / `Use as a reference`.
- **Toasts**: bottom-center, green #0e1a13/#2c5f43, ~3.2s. Key copy: "Date added as a loose piece — it still needs a place on your board."

### 3. Mobile reader — `Planning Coach - Email Reader Mobile v0.1.dc.html`
390×844. Same rules, different frame (§B.2 — same decisions at the same depth).

- **Sticky top bar**: back (44px), `Email · 3 waiting` + subject, `Aa` cycler.
- **Sticky bottom bar**: `Decide` (primary, flex 1.4) · `Files · 3` · `Noticed?` — all open bottom sheets (radius 18px top, drag handle) that leave the passage visible behind a rgba(4,6,9,0.45) scrim.
- **Selection bar**: fixed above the bottom bar; quoted snippet + the four capture chips.
- **Backstop**: bottom sheet variant, identical content/logic to desktop.
- All hit targets ≥44px.

## State Management
Per message: review status (§F.9 six mutually-exclusive statuses via the stated precedence function) · per-finding resolution (act/keep/rule-out with reason; activated vs latent per §E.5) · action status ORTHOGONAL to review status (§F.10). Surface state (text size, section open/closed) persists per student (§Q.1). Noticings fetched on explicit open only; projection enforced server-side, scoped per decision scope.

## Design Tokens
- Background #07090c · card #0b0f15 · card-2 #0d1219 · inset #0a0e14 · borders #1a222c/#161d26/#232b35/#223046
- Text: #eef1f6 (primary) · #cdd5df (body) · #9aa6b4 (secondary) · #8a95a3 · #5f6b7a/#6e7886 (muted) · #4c5a6a (footnote)
- Accents: blue #7fb0e6/#bcd2ec/#3d6da6/#1d365a (links, primary actions) · amber #eec288/#6e5226/#15110a (waiting/stale) · violet #b3a3e0/#4a3f78/#120f1c (noticings/backstop) · green #9fd4b5/#6bbd8f/#2c5f43/#0e1a13 (dates, ready, done) · red #e6a3ae/#7a3b47/#1a0f12 (broken/failed)
- Type: Hanken Grotesk (UI/body) · IBM Plex Mono (labels, chips, counts). Mono labels: 10px, letter-spacing 0.12–0.18em, uppercase.
- Radii: cards 13–16px · buttons 9–11px · chips 999px. Body measure ≤660px.

## Wiring
- `INSTRUCTIONS.md` — **start here if you are Claude Code**: build order, wire rules, required tests, Storybook deliverables, cutover steps.
- `EmailReader.api.js` — adapter between the DCs and the repo's `/api/v1/email` routes (read at main, 2026-08-06). `CAPS` flags mark what wires live vs fixture-only. Honor the wire notes at the top (Idempotency-Key, REVIEW-001, `subject_capture`, `count_is_complete`).
- `GAP-ANALYSIS.md` — route coverage table, backend asks ASK-1..7, and the port plan. **This is a replacement port** of the already-merged Email frontend; carry forward its outbound/reply and sender-policy surfaces.

## Files
- `Planning Coach - Email Queue v0.1.dc.html` — queue, all five ingest states (`ingestState` prop)
- `Planning Coach - Email Reader v0.1.dc.html` — desktop reader
- `Planning Coach - Email Reader Mobile v0.1.dc.html` — mobile reader
- `Planning Coach - Email Reader Wireframes v0.1.dc.html` — the option exploration (context: chosen combo was 1a + 1e + 1g)
- 4 contract/addendum `.md` files (governing rules)
- `support.js` — DC runtime; keep beside the `.dc.html` files to open them

## Known gaps (do not invent)
- "Goes to:" characterization line awaits an owner ruling — ship domain-only until ratified (§RD.5.3).
- Heading-less / hostile-HTML section derivation rules are open (§RD.7.2).
- "As sent" rendering mode is Post-MVP (§RD.7.3).
- Highlight density ceiling unruled (§RD.7.5).
- The fixture content (Arts Collective newsletter, three findings) is demo data; real findings come from the pipeline.
