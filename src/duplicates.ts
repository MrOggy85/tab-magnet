// Finds an already-open tab that is the same issue as a newly opened one.

import type { Workspace } from "./config.js";

/**
 * Returns an existing tab whose canonical issue URL matches newTab's, or null.
 * Only issue pages are compared; boards/backlogs/etc. are never deduplicated.
 * The new tab itself is excluded from the search.
 */
export async function findDuplicate(
  ws: Workspace,
  newTab: chrome.tabs.Tab,
): Promise<chrome.tabs.Tab | null> {
  if (!newTab.url) return null;
  let target: string;
  try {
    target = ws.canonicalUrl(new URL(newTab.url));
  } catch {
    return null;
  }

  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id === newTab.id || !tab.url) continue;
    let url: URL;
    try {
      url = new URL(tab.url);
    } catch {
      continue;
    }
    if (!ws.matches(url) || !ws.isIssue(url)) continue;
    if (ws.canonicalUrl(url) === target) return tab;
  }
  return null;
}
