// Template for your workspace host lists. Copy this file to `sites.ts` (which is
// gitignored) and edit the hosts for your own environment — this keeps private
// / internal domains out of version control.
//
//   cp src/sites.example.ts src/sites.ts
//
// `hosts` entries match by exact hostname OR as a parent domain, so
// "atlassian.net" also matches "yourcompany.atlassian.net".

import type { SiteConfig } from "./config.js";

export const SITES: SiteConfig[] = [
  {
    id: "jira",
    title: "Jira",
    color: "blue",
    hosts: ["atlassian.net"],
    browseIssues: true,
  },
  {
    id: "confluence",
    title: "Confluence",
    color: "green",
    hosts: ["wiki.example.com"],
  },
  {
    id: "github",
    title: "GitHub",
    color: "grey",
    hosts: ["github.com"],
  },
];
