PRD: TabMagnet Chrome Extension

Overview

Build a Chrome Extension (Manifest V3) that automatically organizes Jira tabs into a dedicated workspace.

The primary goal is to eliminate scattered Jira tabs that originate from Slack, GitHub PRs, emails, calendars, and other applications.

This extension should work automatically with no user interaction after installation.

⸻

Problem

Currently Jira links are opened from many different sources:

* Slack
* GitHub PRs
* Email
* Documentation
* Browser search
* Other Jira pages

This causes Jira tabs to become scattered across many Chrome windows.

I want every Jira tab to live in one dedicated Chrome window and one dedicated Tab Group called Jira.

⸻

Goals

When a Jira URL opens:

1. Detect it immediately.
2. Find the dedicated Jira window.
3. Move the tab into that window.
4. Place it into the existing Jira Tab Group.
5. Focus that window.

If the Jira window doesn’t exist:

1. Create one.
2. Create the Jira Tab Group.
3. Move the tab there.
4. Focus it.

The process should feel automatic.

⸻

Supported URLs

Initially support:

https://*.atlassian.net/*

Later make this configurable.

⸻

Functional Requirements

Detect Jira tabs

Listen for:

* tab created
* tab updated
* URL changes

Whenever a tab becomes a Jira URL:

*.atlassian.net/*

begin organization.

⸻

Jira Window

Exactly one Jira workspace window should exist.

If multiple exist:

Use the first one found.

(Handling merging multiple Jira windows can be a future enhancement.)

⸻

Jira Tab Group

Inside the Jira window there should be one group.

Title:

Jira

Color:

blue

If missing:

Create it.

⸻

Moving Tabs

When a Jira tab is opened:

If already inside the Jira window:

* only add it to the Jira group.

Otherwise:

* move it into the Jira window
* insert at the end
* group it

⸻

Focus

After moving:

Focus:

* Jira window
* moved tab

⸻

Duplicate Detection (V1.1)

If a Jira issue is already open:

Instead of keeping two tabs:

* activate existing tab
* close newly opened duplicate

Normalize URLs before comparison.

Example:

These are duplicates:

ABC-123
ABC-123?focusedCommentId=12345
ABC-123?atlOrigin=xyz

Compare only the canonical issue URL.

⸻

Ignore Pages

Do not deduplicate:

Board
Backlog
Sprint
Search
Dashboard
Filters

Only issue pages.

⸻

Persistence

The extension should remember:

* Jira window ID
* Jira group ID

using:

chrome.storage.local

If IDs become invalid (Chrome restart):

rediscover them.

Never assume IDs remain valid.

⸻

Permissions

Need:

tabs
tabGroups
storage

Host permissions:

https://*.atlassian.net/*

⸻

Architecture

background.js
├── Tab watcher
├── URL matcher
├── Jira workspace manager
├── Tab group manager
├── Duplicate detector
└── Storage manager

⸻

Helper Modules

url.ts
isJira()
isIssue()
canonicalIssueUrl()
workspace.ts
findWorkspaceWindow()
createWorkspaceWindow()
findGroup()
createGroup()
duplicates.ts
findDuplicate()
normalizeUrl()

⸻

Desired Behavior

Scenario:

Slack
↓
Click Jira link
↓
Chrome opens new tab
↓
Extension detects Jira
↓
Move tab
↓
Existing Jira window
↓
Existing Jira group
↓
Focus Jira window

⸻

Scenario 2:

No Jira window exists
↓
Click Jira link
↓
Create window
↓
Create group
↓
Move tab
↓
Focus

⸻

Scenario 3:

ABC-123 already open
↓
Click ABC-123 again
↓
Focus existing tab
↓
Close duplicate

⸻

Nice-to-Have (Later, Out of Scope)

* Configurable domains
* Regex URL matching
* Keyboard shortcut to send current tab to Jira workspace
* Right-click “Move to Jira Workspace”
* Automatically pin:
    * Board
    * Backlog
    * Sprint
* Auto-sort issue tabs alphabetically
* Recently closed Jira issues
* Settings page
* Export/import settings

⸻

Technical Constraints

* Keep it simple (KISS)
* Manifest V3 only.
* Use TypeScript.
* No external dependencies unless they provide significant value.
* Keep the architecture modular and testable.
* Handle Chrome API failures gracefully.
* Avoid race conditions when multiple Jira tabs are opened simultaneously (e.g., user middle-clicks several issue links).

⸻

Success Criteria

* Clicking a Jira link from any source results in exactly one Jira workspace window.
* All Jira tabs are grouped under a single Jira tab group.
* Duplicate issue tabs are prevented.
* The extension requires no manual organization after initial setup.
* Performance impact is negligible during normal browsing.
