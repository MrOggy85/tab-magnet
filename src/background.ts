// Orchestrator: watches tabs, and for each matching tab either deduplicates it
// or adds it to its workspace group in the tab's current window (tabs are never
// moved between windows). All handling is serialized through a single promise
// chain so simultaneously-opened tabs (e.g. several middle-clicked issue links)
// cannot create competing groups in the same window.

import { workspaceForUrl } from "./config.js";
import { placeTab, focus } from "./workspace.js";
import { findDuplicate } from "./duplicates.js";

const TAB_GROUP_ID_NONE = -1;

let queue: Promise<void> = Promise.resolve();

function enqueue(task: () => Promise<void>): void {
  queue = queue.then(task).catch((err) => {
    console.error("[tab-magnet]", err);
  });
}

async function handle(tabId: number): Promise<void> {
  let tab: chrome.tabs.Tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch {
    return; // tab already closed
  }

  const ws = workspaceForUrl(tab.url);
  if (!ws || tab.id == null || !tab.url) return;
  const url = new URL(tab.url);

  // Duplicate issue already open: activate it and drop the new tab.
  if (ws.isIssue(url)) {
    const existing = await findDuplicate(ws, tab);
    if (existing?.id != null) {
      await focus(existing.windowId, existing.id);
      try {
        await chrome.tabs.remove(tab.id);
      } catch {
        /* already gone */
      }
      return;
    }
  }

  // Already in the workspace group: nothing to do.
  if (tab.groupId !== TAB_GROUP_ID_NONE) {
    try {
      const group = await chrome.tabGroups.get(tab.groupId);
      if (group.title === ws.title) return;
    } catch {
      /* group vanished — fall through and re-place */
    }
  }

  await placeTab(ws, tab);
}

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id != null) enqueue(() => handle(tab.id!));
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // React when the URL changes or the page finishes loading.
  if (changeInfo.url || changeInfo.status === "complete") {
    enqueue(() => handle(tabId));
  }
});
