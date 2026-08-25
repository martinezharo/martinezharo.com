import { PROJECT_KINDS, SORT_FIELDS } from './model';
import type { SortField } from './model';
import type { ProjectState } from './ordering';

// Where the list's state waits between pages.
//
// The state is client-side and lives nowhere else: the list is rendered by the
// server in one fixed order and the browser rearranges it, so leaving the page
// would normally forget everything the visitor chose. A project page needs it
// back to say what comes next.
//
// It is kept in `sessionStorage` rather than in the address: a project's URL
// stays clean and shareable, the page can still be cached as one document, and
// the choice dies with the tab — which is the same life the list's own state
// has, since a fresh visit to the home page starts on the default order again.

const KEY = 'olisite:projects';

/** Storage can be missing or refuse to answer; the site works either way. */
function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function isField(value: unknown): value is SortField {
  return SORT_FIELDS.some((sort) => sort.key === value);
}

function isKind(value: unknown): value is string {
  return value === 'all' || PROJECT_KINDS.some((kind) => kind === value);
}

/**
 * The stored state, or null when there is none to read.
 *
 * Every field is checked rather than trusted. What comes back is a string the
 * tab has been carrying since some earlier version of this site wrote it, and
 * a state naming a filter that no longer exists would quietly empty the list
 * it is applied to.
 */
export function readProjectState(): ProjectState | null {
  const raw = storage()?.getItem(KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const { field, direction, kind, status } = parsed as Record<string, unknown>;
    if (!isField(field) || !isKind(kind)) return null;
    if (direction !== 'asc' && direction !== 'desc') return null;
    if (status !== 'all' && status !== 'active' && status !== 'archived') return null;

    return { field, direction, kind, status };
  } catch {
    return null;
  }
}

/**
 * Records what the list is showing. It is written on every pass, including the
 * one that only mirrors the state the page was served in, so what is stored is
 * always what the list last had on screen rather than the last thing that was
 * pressed.
 */
export function writeProjectState(state: ProjectState): void {
  try {
    storage()?.setItem(KEY, JSON.stringify(state));
  } catch {
    // A full or locked store is not worth interrupting the page for.
  }
}
