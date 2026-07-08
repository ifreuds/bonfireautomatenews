# CLAUDE.md

Working agreements for this workspace. These apply to **any kind of work** here — code, docs, plans, research, ops, analysis — not just code.

**Tradeoff:** these bias toward caution over speed. For trivial tasks, use judgment.

---

## Execution principles

*(Adapted from Andrej Karpathy's coding guidelines — generalized to all work.)*

### 1. Think Before Acting
**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't silently pick one.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum scope that solves the problem. Nothing speculative.**

- No features, sections, frameworks, or polish beyond what was asked.
- No abstractions — or process, tooling, or structure — for single-use work.
- No "flexibility" or "configurability" that wasn't requested.
- No handling for scenarios that can't happen.
- If the deliverable is 3 pages and could be 1, rewrite it.

Ask: *"Would an experienced practitioner call this overcomplicated?"* If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing an existing document, plan, config, or file:
- Change only what was asked. **Don't silently rewrite adjacent sections**, headings, or formatting.
- Don't "improve" or refactor what isn't broken. Match the existing style and voice, even if you'd do it differently.
- If you notice something unrelated that's wrong, stale, or dead — **mention it, don't delete or fix it** unsolicited.
- Remove only the orphans *your* change created.

The test: every changed line traces directly to the request.

### 4. Goal-Driven Execution
**Define what "done" looks like before starting, then verify against it.**

Turn tasks into verifiable goals:
- "Make the newsletter better" → "every story published ≤30 days ago, every link returns 200, zero repeats vs the archive."
- "Fix the bug" → "reproduce it, then show it no longer reproduces."

For multi-step work, state a brief plan with a check per step:
```
1. [step] → verify: [check]
2. [step] → verify: [check]
```

Report outcomes honestly. If a check failed, say so with the evidence. Never claim done without verifying.

**These are working if:** fewer unnecessary edits, fewer rewrites from overcomplication, and clarifying questions arrive *before* the work rather than after the mistake.

---

## Knowledge base (LLM Wiki pattern)

**Structure**
- `raw/` — unprocessed source material dropped in by the user (notes, screenshots, articles, transcripts, drafts, data dumps). **Read-only: never edit these.**
- `wiki/` — one markdown page per concept / topic / decision, written and maintained by Claude.
- `index.md` — master map of `wiki/`, one line per page. Kept short enough to fit in context.

**Operations**
- **Ingest** — when material lands in `raw/`, or we settle something in conversation: summarize it, file the key ideas into the right `wiki/` page(s), update `index.md`.
- **Query** — when asked a question: read `index.md` first, open only the relevant `wiki/` pages, then answer (citing the pages).
- **Lint** — on request: audit `wiki/` for contradictions, stale claims superseded by newer decisions, and orphan pages. Report; don't silently fix.

**Rules**
- Keep pages short and factual. Date every decision.
- Prefer updating an existing page over creating a near-duplicate.
- Humans curate (source material, strategy); Claude maintains (summarizing, filing, cross-referencing).
