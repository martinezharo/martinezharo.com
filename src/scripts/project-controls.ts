// Client behaviour for the project list. The list is rendered on the server;
// this only reorders and hides the rows that are already there, so the page
// still shows every project without JavaScript.

export type SortKey =
  | 'recent'
  | 'oldest'
  | 'alpha'
  | 'overall'
  | 'craft'
  | 'depth'
  | 'utility'
  | 'impact';

export type Filter = 'all' | 'active';

const METRICS = ['overall', 'craft', 'depth', 'utility', 'impact'] as const;

const isMetric = (sort: SortKey): sort is (typeof METRICS)[number] =>
  (METRICS as readonly string[]).includes(sort);

const num = (el: HTMLElement, key: string) => Number(el.dataset[key] ?? 0);
const title = (el: HTMLElement) => el.dataset.name ?? '';

function compare(a: HTMLElement, b: HTMLElement, sort: SortKey) {
  const alpha = title(a).localeCompare(title(b), 'en');
  switch (sort) {
    case 'recent':
      return num(b, 'start') - num(a, 'start') || alpha;
    case 'oldest':
      return num(a, 'start') - num(b, 'start') || alpha;
    case 'alpha':
      return alpha;
    default:
      return num(b, sort) - num(a, sort) || alpha;
  }
}

export function initControls(root: HTMLElement | null) {
  if (!root) return;

  const list = root.querySelector<HTMLElement>('[data-list]');
  if (!list) return;

  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-item]'));
  const filterButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const sortButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sort]'));
  const sortSelect = root.querySelector<HTMLSelectElement>('[data-sort-select]');
  // Counters and controls can appear more than once (a desktop panel plus a
  // mobile bar), so every matching node is kept in sync.
  const shown = Array.from(root.querySelectorAll<HTMLElement>('[data-count-shown]'));
  const total = Array.from(root.querySelectorAll<HTMLElement>('[data-count-total]'));
  const empty = Array.from(root.querySelectorAll<HTMLElement>('[data-empty]'));

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let filter: Filter = (root.dataset.stateFilter as Filter) ?? 'all';
  let sort: SortKey = (root.dataset.stateSort as SortKey) ?? 'recent';

  for (const node of total) node.textContent = String(items.length);

  function apply({ animate = true } = {}) {
    const before = new Map(items.map((item) => [item, item.getBoundingClientRect().top]));

    const visible = items.filter((item) => filter === 'all' || item.dataset.active === 'true');
    const ordered = [...visible].sort((a, b) => compare(a, b, sort));

    for (const item of items) item.hidden = !visible.includes(item);
    for (const item of ordered) {
      list!.append(item);
      // The spine gauge in A3 reads this; it is absent for date and name orders.
      if (isMetric(sort)) item.style.setProperty('--sorted', item.dataset[sort] ?? '0');
      else item.style.removeProperty('--sorted');
    }

    root!.dataset.stateFilter = filter;
    root!.dataset.stateSort = sort;
    for (const button of filterButtons)
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    for (const button of sortButtons)
      button.setAttribute('aria-pressed', String(button.dataset.sort === sort));
    if (sortSelect && sortSelect.value !== sort) sortSelect.value = sort;
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

  for (const button of filterButtons) {
    button.addEventListener('click', () => {
      filter = (button.dataset.filter as Filter) ?? 'all';
      apply();
    });
  }

  for (const button of sortButtons) {
    button.addEventListener('click', () => {
      sort = (button.dataset.sort as SortKey) ?? 'recent';
      apply();
    });
  }

  sortSelect?.addEventListener('change', () => {
    sort = sortSelect.value as SortKey;
    apply();
  });

  root.dataset.ready = 'true';
  apply({ animate: false });
}
