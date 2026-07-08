// Workspace wiring. This file is generic and contains NO specific URLs — the
// host lists live in `sites.ts` (gitignored; copy `sites.example.ts` to start).

import { hostMatches, isBrowseIssue, canonicalBrowseUrl } from "./url.js";
import { SITES } from "./sites.js";

/** Site definition supplied by sites.ts — pure data, no behavior. */
export type SiteConfig = {
  /** Stable key used for chrome.storage. */
  id: string;
  /** Tab group title. */
  title: string;
  /** Tab group color. */
  color: chrome.tabGroups.Color;
  /** Hosts owned by this workspace (exact host or parent domain). */
  hosts: string[];
  /** When true, /browse/KEY-123 pages are deduplicated. Default false. */
  browseIssues?: boolean;
};

/** Runtime workspace: a SiteConfig compiled into matcher/dedup functions. */
export type Workspace = {
  id: string;
  title: string;
  color: chrome.tabGroups.Color;
  matches: (url: URL) => boolean;
  isIssue: (url: URL) => boolean;
  canonicalUrl: (url: URL) => string;
};

function toWorkspace(site: SiteConfig): Workspace {
  return {
    id: site.id,
    title: site.title,
    color: site.color,
    matches: (url) => hostMatches(url, site.hosts),
    isIssue: site.browseIssues ? isBrowseIssue : () => false,
    canonicalUrl: site.browseIssues
      ? canonicalBrowseUrl
      : (url) => url.origin + url.pathname,
  };
}

export const WORKSPACES: Workspace[] = SITES.map(toWorkspace);

/** Returns the workspace that owns a raw URL string, or null. */
export function workspaceForUrl(rawUrl: string | undefined): Workspace | null {
  if (!rawUrl) return null;
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  return WORKSPACES.find((ws) => ws.matches(url)) ?? null;
}
