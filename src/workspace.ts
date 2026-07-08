// Adds tabs to their workspace tab group, in place. Tabs are never moved
// between windows: the group lives in whatever window the tab is already in
// (one group per window, discovered by title).

import type { Workspace } from "./config.js";

/** Finds the workspace group within a specific window, or null. */
async function findGroupInWindow(
  ws: Workspace,
  windowId: number,
): Promise<number | null> {
  const groups = await chrome.tabGroups.query({ title: ws.title, windowId });
  return groups.length > 0 ? groups[0].id : null;
}

/** Focuses a window and activates a tab within it. Best-effort. */
export async function focus(windowId: number, tabId: number): Promise<void> {
  try {
    await chrome.windows.update(windowId, { focused: true });
  } catch {
    /* window gone */
  }
  try {
    await chrome.tabs.update(tabId, { active: true });
  } catch {
    /* tab gone */
  }
}

/**
 * Adds a tab to its workspace group within the tab's current window, creating
 * the group there if it doesn't exist yet. Does not move or focus anything.
 */
export async function placeTab(ws: Workspace, tab: chrome.tabs.Tab): Promise<void> {
  if (tab.id == null) return;
  const tabId = tab.id;
  const windowId = tab.windowId;

  const groupId = await findGroupInWindow(ws, windowId);
  if (groupId != null) {
    await chrome.tabs.group({ tabIds: [tabId], groupId });
    return;
  }

  const newGroupId = await chrome.tabs.group({
    tabIds: [tabId],
    createProperties: { windowId },
  });
  await chrome.tabGroups.update(newGroupId, { title: ws.title, color: ws.color });
}
