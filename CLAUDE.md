# TabMagnet

Manifest V3 Chrome extension (TypeScript, no runtime deps). A background service
worker watches tabs and adds each matching tab to a per-window tab group; Jira
issue tabs are also deduplicated. See PROJECT.md for the full spec.

## Layout
- `src/config.ts` — generic wiring: compiles `SITES` into `WORKSPACES`. **No URLs.**
- `src/sites.ts` — host lists (**gitignored**; copy from `sites.example.ts`).
- `src/url.ts` — pure, unit-tested URL helpers.
- `src/workspace.ts` — groups a tab in its **current** window (never moves tabs).
- `src/duplicates.ts`, `src/background.ts` — dedupe + the serialized event loop.
- `src/chrome.d.ts` — hand-written Chrome API types (no `@types/chrome`).

## Commands
- `npm run build` — `tsc` → `dist/`.
- `npm test` — `node --test`; type-stripping runs the `.ts` tests directly.

## Conventions / gotchas
- ESM: source is `.ts`, but imports reference `.js` (e.g. `./url.js`). Don't "fix" to `.ts` — tsc doesn't rewrite specifiers and the browser loads `.js`.
- Keep committed source URL-free. Real hosts go only in `src/sites.ts`; tests use `example.com` placeholders.
- Add a workspace by appending one object to `SITES` — no other code changes.
- Using a new Chrome API? Add its types to `src/chrome.d.ts`.
- No `host_permissions` needed — the `tabs` permission already exposes tab URLs.
- Runtime behavior can't be unit-tested; verify by loading unpacked in Chrome.
