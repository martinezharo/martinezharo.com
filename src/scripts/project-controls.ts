// Client behaviour for the project list. The list is rendered on the server;
// this only reorders and hides the rows that are already there, so the page
// still shows every project without JavaScript.
//
// The state is four things: a status, a type, the field the list is ordered by
// and the direction it runs in. Order is a field plus a direction rather than
// one flat list of orders — "Date + newest first" instead of "Newest" — which
// is what lets one control cover both ways round.
//
// Nothing here draws a control. Anything on the page can drive the state by
// carrying an attribute: [data-set-*] applies a value, [data-clear] puts a
// dimension back to its default, [data-echo] prints a piece of the state in
// words and [data-chip] hides itself while its dimension is untouched. The
// menu those attributes hang off lives in project-facets.ts.

export type SortField = 'date' | 'name' | 'overall' | 'craft' | 'depth' | 'utility' | 'impact';
export type Dir = 'desc' | 'asc';
export type Status = 'all' | 'active' | 'archived';

export const SORT_FIELDS: { key: SortField; label: string }[] = [
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Name' },
  { key: 'overall', label: 'Overall rating' },
  { key: 'craft', label: 'Craft' },
  { key: 'depth', label: 'Depth' },
  { key: 'utility', label: 'Utility' },
  { key: 'impact', label: 'Impact' },
];

/** The direction names itself after the field, so it always reads as English. */
export const DIR_LABEL: Record<SortField, Record<Dir, string>> = {
  date: { desc: 'Newest first', asc: 'Oldest first' },
  name: { desc: 'Z to A', asc: 'A to Z' },
  overall: { desc: 'Highest first', asc: 'Lowest first' },
  craft: { desc: 'Highest first', asc: 'Lowest first' },
  depth: { desc: 'Highest first', asc: 'Lowest first' },
  utility: { desc: 'Highest first', asc: 'Lowest first' },
  impact: { desc: 'Highest first', asc: 'Lowest first' },
};

/** Neutral values name their own dimension, so a lone value still reads. */
export const STATUS_LABEL: Record<Status, string> = {
  all: 'Every status',
  active: 'Active',
  archived: 'Archived',
};

const num = (el: HTMLElement, key: string) => Number(el.dataset[key] ?? 0);
const name = (el: HTMLElement) => el.dataset.name ?? '';
const byName = (a: HTMLElement, b: HTMLElement) => name(a).localeCompare(name(b), 'en');

/** Ascending comparison for the chosen field; the direction flips it later. */
function compare(a: HTMLElement, b: HTMLElement, field: SortField) {
  if (field === 'name') return byName(a, b);
  return num(a, field === 'date' ? 'start' : field) - num(b, field === 'date' ? 'start' : field);
}

export function initControls(root: HTMLElement | null) {
  if (!root) return;

  const list = root.querySelector<HTMLElement>('[data-list]');
  if (!list) return;

  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-item]'));
  const setStatus = Array.from(root.querySelectorAll<HTMLElement>('[data-set-status]'));
  const setKind = Array.from(root.querySelectorAll<HTMLElement>('[data-set-kind]'));
  const setSort = Array.from(root.querySelectorAll<HTMLElement>('[data-set-sort]'));
  const setDir = Array.from(root.querySelectorAll<HTMLElement>('[data-set-dir]'));
  const clears = Array.from(root.querySelectorAll<HTMLElement>('[data-clear]'));
  const echoes = Array.from(root.querySelectorAll<HTMLElement>('[data-echo]'));
  const chips = Array.from(root.querySelectorAll<HTMLElement>('[data-chip]'));
  const dirNames = Array.from(root.querySelectorAll<HTMLElement>('[data-dir-name]'));
  // Counters can appear more than once, so every matching node is kept in sync.
  const shown = Array.from(root.querySelectorAll<HTMLElement>('[data-count-shown]'));
  const total = Array.from(root.querySelectorAll<HTMLElement>('[data-count-total]'));
  const empty = Array.from(root.querySelectorAll<HTMLElement>('[data-empty]'));

  const still = matchMedia('(prefers-reduced-motion: reduce)');

  let field = (root.dataset.stateField as SortField) ?? 'date';
  let dir = (root.dataset.stateDir as Dir) ?? 'desc';
  let kind = root.dataset.stateKind ?? 'all';
  let status = (root.dataset.stateStatus as Status) ?? 'all';

  for (const node of total) node.textContent = String(items.length);

  function check(node: HTMLElement, on: boolean) {
    node.dataset.picked = String(on);
    node.setAttribute('aria-checked', String(on));
  }

  /** The current state as the words the page would use for it. */
  function echo(which: string) {
    if (which === 'status') return STATUS_LABEL[status];
    // The name of a type is already printed by the item that selects it, and a
    // menu item carries it on [data-label] since its own text holds a count.
    if (which === 'kind') {
      if (kind === 'all') return 'Every type';
      const source = root!.querySelector<HTMLElement>(`[data-set-kind="${kind}"]`);
      return source?.dataset.label ?? kind;
    }
    if (which === 'sort') return SORT_FIELDS.find((sort) => sort.key === field)?.label ?? '';
    if (which === 'dir') return DIR_LABEL[field][dir];
    // The order is one clause even though it is two pieces of state, because
    // "Date" alone does not say which end of the list you are looking at.
    if (which === 'order')
      return `${SORT_FIELDS.find((sort) => sort.key === field)?.label ?? ''}, ${DIR_LABEL[field][dir].toLowerCase()}`;
    return '';
  }

  function visible(item: HTMLElement) {
    if (kind !== 'all' && item.dataset.kind !== kind) return false;
    if (status === 'active' && item.dataset.active !== 'true') return false;
    if (status === 'archived' && item.dataset.active === 'true') return false;
    return true;
  }

  function apply({ animate = true } = {}) {
    const before = new Map(items.map((item) => [item, item.getBoundingClientRect().top]));
    const sign = dir === 'asc' ? 1 : -1;

    const ordered = items
      .filter(visible)
      .sort((a, b) => compare(a, b, field) * sign || byName(a, b));

    for (const item of items) item.hidden = !visible(item);
    for (const item of ordered) list!.append(item);

    root!.dataset.stateField = field;
    root!.dataset.stateDir = dir;
    root!.dataset.stateKind = kind;
    root!.dataset.stateStatus = status;

    for (const node of setStatus) check(node, status === node.dataset.setStatus);
    for (const node of setKind) check(node, kind === node.dataset.setKind);
    for (const node of setSort) check(node, field === node.dataset.setSort);
    for (const node of setDir) check(node, dir === node.dataset.setDir);
    for (const node of dirNames) node.textContent = DIR_LABEL[field][node.dataset.dirName as Dir];
    for (const node of echoes) node.textContent = echo(node.dataset.echo ?? '');
    // A clause is only worth printing once its dimension has been moved off the
    // value it holds by default.
    for (const node of chips) {
      const which = node.dataset.chip;
      node.hidden =
        which === 'order' ? field === 'date' && dir === 'desc' : (which === 'kind' ? kind : status) === 'all';
    }
    for (const node of shown) node.textContent = String(ordered.length);
    for (const node of empty) node.hidden = ordered.length > 0;

    if (!animate || still.matches) return;

    // FLIP: the rows slide from where they were to where they now are.
    for (const item of ordered) {
      const start = before.get(item);
      if (start === undefined) continue;
      const delta = start - item.getBoundingClientRect().top;
      if (!delta) continue;
      item.animate(
        [{ transform: `translateY(${delta}px)` }, { transform: 'translateY(0)' }],
        { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' },
      );
    }
  }

  for (const node of setStatus)
    node.addEventListener('click', () => {
      status = node.dataset.setStatus as Status;
      apply();
    });

  for (const node of setKind)
    node.addEventListener('click', () => {
      kind = node.dataset.setKind!;
      apply();
    });

  for (const node of setSort)
    node.addEventListener('click', () => {
      const wanted = node.dataset.setSort as SortField;
      // Names read forwards by default; dates and ratings read best-first.
      if (wanted !== field) dir = wanted === 'name' ? 'asc' : 'desc';
      field = wanted;
      apply();
    });

  for (const node of setDir)
    node.addEventListener('click', () => {
      dir = node.dataset.setDir as Dir;
      apply();
    });

  for (const node of clears)
    node.addEventListener('click', () => {
      const which = node.dataset.clear;
      // Every dimension goes back to its default, and the order has one too.
      if (which === 'order') {
        field = 'date';
        dir = 'desc';
      } else {
        if (which !== 'kind') status = 'all';
        if (which !== 'status') kind = 'all';
      }
      apply();
    });

  root.dataset.ready = 'true';
  apply({ animate: false });
}
