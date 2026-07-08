// Pure, workspace-agnostic URL helpers. No Chrome APIs — unit-tested in isolation.

// Matches a Jira issue path like /browse/ABC-123 and captures the issue key.
const ISSUE_PATH = /^\/browse\/([A-Z][A-Z0-9]*-\d+)/;

/** True if the URL's host equals one of `hosts` or is a subdomain of one. */
export function hostMatches(url: URL, hosts: string[]): boolean {
  return hosts.some(
    (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
  );
}

/**
 * True only for Jira issue pages (/browse/KEY-123). Boards, backlogs, sprints,
 * searches, dashboards and filters live on other paths and return false, so
 * they are grouped but never deduplicated.
 */
export function isBrowseIssue(url: URL): boolean {
  return ISSUE_PATH.test(url.pathname);
}

/**
 * Canonical key for a Jira issue: origin + /browse/KEY-123, with query and hash
 * stripped. Collapses ABC-123, ABC-123?focusedCommentId=1 and
 * ABC-123?atlOrigin=xyz to the same value. Falls back to origin+pathname for
 * non-issue URLs.
 */
export function canonicalBrowseUrl(url: URL): string {
  const match = url.pathname.match(ISSUE_PATH);
  if (!match) return url.origin + url.pathname;
  return `${url.origin}/browse/${match[1]}`;
}
