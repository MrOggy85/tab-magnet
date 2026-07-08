# TabMagnet

Chrome extension that automatically routes tabs from configured sites into
dedicated tab groups. See [PROJECT.md](PROJECT.md) for the full spec.

## Configure

Workspace host lists live in `src/sites.ts`, which is **gitignored** so private
or internal domains never get committed. Start from the template:

```sh
cp src/sites.example.ts src/sites.ts
```

Then edit `src/sites.ts`. Each entry is a `SiteConfig`:

```ts
{
  id: "jira",              // stable key
  title: "Jira",           // tab group title
  color: "blue",           // tab group color
  hosts: ["atlassian.net"],// exact host, or a parent domain (matches subdomains)
  browseIssues: true,      // optional: dedupe /browse/KEY-123 issue pages
}
```

Adding a new group is just another object in the `SITES` array — no other code
changes. The matcher/dedupe logic in [`src/config.ts`](src/config.ts) is generic
and contains no URLs.

## Develop

```sh
npm install
cp src/sites.example.ts src/sites.ts   # first time only
npm run build      # compile src/ -> dist/
npm run watch      # rebuild on change
npm test           # unit tests for the URL helpers
```

## Load in Chrome

1. Create `src/sites.ts` (see **Configure**) and run `npm run build`.
2. Open `chrome://extensions`, enable **Developer mode**.
3. **Load unpacked** and select this repository's root folder.

The service worker (`dist/background.js`) starts automatically. Open a Jira
`/browse/KEY-123` link and it is added to the Jira tab group in its current
window (a group is created per window as needed; tabs are never moved between
windows).

No `host_permissions` are declared: the `tabs` permission already grants URL
access to all tabs, and moving/grouping needs only `tabs`/`tabGroups`.
