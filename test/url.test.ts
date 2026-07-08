import { test } from "node:test";
import assert from "node:assert/strict";
import { hostMatches, isBrowseIssue, canonicalBrowseUrl } from "../src/url.ts";

const u = (s: string) => new URL(s);

// Placeholder host lists — the real ones live in the gitignored src/sites.ts.
// These tests exercise the generic helpers, which take hosts as arguments and
// never depend on any specific domain.
const JIRA_HOSTS = ["jira.example.com", "atlassian.net"];
const WIKI_HOSTS = ["wiki.example.com"];

const JIRA_BOARD =
  "https://jira.example.com/jira/software/c/projects/ABC/boards/122?assignee=unassigned";
const WIKI_PAGE =
  "https://wiki.example.com/wiki/spaces/TEAM/pages/12345/Some+Page+Title";

test("hostMatches: matches the exact host and parent-domain hosts", () => {
  assert.equal(hostMatches(u(JIRA_BOARD), JIRA_HOSTS), true);
  assert.equal(hostMatches(u("https://acme.atlassian.net/browse/ABC-1"), JIRA_HOSTS), true);
  assert.equal(hostMatches(u(WIKI_PAGE), JIRA_HOSTS), false);
  assert.equal(hostMatches(u("https://github.com/x"), JIRA_HOSTS), false);
  assert.equal(hostMatches(u("https://evil-atlassian.net/x"), JIRA_HOSTS), false);
});

test("hostMatches: a narrower list matches only its host", () => {
  assert.equal(hostMatches(u(WIKI_PAGE), WIKI_HOSTS), true);
  assert.equal(hostMatches(u(JIRA_BOARD), WIKI_HOSTS), false);
});

test("isBrowseIssue: true for /browse/KEY-123 on any host", () => {
  assert.equal(isBrowseIssue(u("https://jira.example.com/browse/ABC-123")), true);
  assert.equal(isBrowseIssue(u("https://acme.atlassian.net/browse/ABC-123?atlOrigin=x")), true);
});

test("isBrowseIssue: false for boards, dashboards, wiki pages", () => {
  assert.equal(isBrowseIssue(u(JIRA_BOARD)), false);
  assert.equal(isBrowseIssue(u(WIKI_PAGE)), false);
  assert.equal(isBrowseIssue(u("https://jira.example.com/jira/dashboards/10000")), false);
});

test("canonicalBrowseUrl: collapses query/hash variants to one key", () => {
  const base = "https://jira.example.com/browse/ABC-123";
  assert.equal(canonicalBrowseUrl(u(base)), base);
  assert.equal(canonicalBrowseUrl(u(`${base}?focusedCommentId=12345`)), base);
  assert.equal(canonicalBrowseUrl(u(`${base}?atlOrigin=xyz`)), base);
  assert.equal(canonicalBrowseUrl(u(`${base}#comment`)), base);
});

test("canonicalBrowseUrl: different issues stay distinct", () => {
  assert.notEqual(
    canonicalBrowseUrl(u("https://jira.example.com/browse/ABC-123")),
    canonicalBrowseUrl(u("https://jira.example.com/browse/ABC-124")),
  );
});
