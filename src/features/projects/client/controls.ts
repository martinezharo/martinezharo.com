import { FILTER_CLAUSES } from '../filter-options';
import { type ProjectStatus, type SortDirection, type SortField } from '../model';
import { compareRanked, type Ranked } from '../ordering';
import { writeProjectState } from '../state-store';
import { getCopy, isLocale, type Locale } from '../../../i18n';

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
// words, [data-chip] hides itself while its dimension is untouched and
// [data-announce] receives the sentence a screen reader hears after a change.
// The menu those attributes hang off lives in the facets module.

/**
 * A row as something to be ordered. A rating the project is not on was left
 * off the element rather than written as a zero, which is what lets `null`
 * here mean "not on that scale" instead of "worst on it".
 */
function rank(el: HTMLElement): Ranked {
  return {
    name: el.dataset.name ?? '',
    rated: Number(el.dataset.ratedCount ?? 0),
    value(field) {
      const key = field === 'date' ? 'start' : field === 'default' ? 'overall' : field;
      const raw = el.dataset[key];
      return raw === undefined ? null : Number(raw);
    },
  };
}

export function initProjectControls(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[data-list]');
  if (!list) return;

  const locale: Locale = isLocale(root.dataset.locale) ? root.dataset.locale : 'en';
  const copy = getCopy(locale);

  // Keep a non-null alias for callbacks that run after this initializer exits.
  const projectList = list;

  const items = Array.from(projectList.querySelectorAll<HTMLElement>('[data-item]'));
  const setStatus = Array.from(root.querySelectorAll<HTMLElement>('[data-set-status]'));
  const setKind = Array.from(root.querySelectorAll<HTMLElement>('[data-set-kind]'));
  const setSort = Array.from(root.querySelectorAll<HTMLElement>('[data-set-sort]'));
  const setDir = Array.from(root.querySelectorAll<HTMLElement>('[data-set-dir]'));
  const clears = Array.from(root.querySelectorAll<HTMLElement>('[data-clear]'));
  const echoes = Array.from(root.querySelectorAll<HTMLElement>('[data-echo]'));
  const chips = Array.from(root.querySelectorAll<HTMLElement>('[data-chip]'));
  const dirNames = Array.from(root.querySelectorAll<HTMLElement>('[data-dir-name]'));
  const empty = Array.from(root.querySelectorAll<HTMLElement>('[data-empty]'));
  const announcers = Array.from(root.querySelectorAll<HTMLElement>('[data-announce]'));

  const still = matchMedia('(prefers-reduced-motion: reduce)');

  let field = (root.dataset.stateField as SortField) ?? 'default';
  let dir = (root.dataset.stateDir as SortDirection) ?? 'desc';
  let kind = root.dataset.stateKind ?? 'all';
  let status = (root.dataset.stateStatus as ProjectStatus) ?? 'all';

  function check(node: HTMLElement, on: boolean) {
    node.dataset.picked = String(on);
    node.setAttribute('aria-checked', String(on));
  }

  /** The current state as the words the page would use for it. */
  function echo(which: string) {
    if (which === 'status') return copy.projects.filters.statusLabels[status];
    // The name of a type is already printed by the item that selects it, and a
    // menu item carries it on [data-label] since its own text holds a count.
    if (which === 'kind') {
      if (kind === 'all') return copy.projects.kindLabels.all;
      const source = root.querySelector<HTMLElement>(`[data-set-kind="${kind}"]`);
      return source?.dataset.label ?? kind;
    }
    if (which === 'sort') return copy.projects.filters.sortLabels[field] ?? '';
    if (which === 'dir') return copy.projects.filters.directionLabels[field][dir];
    // The order is one clause even though it is two pieces of state, because
    // "Date" alone does not say which end of the list you are looking at.
    if (which === 'order')
      return `${copy.projects.filters.sortLabels[field] ?? ''}, ${copy.projects.filters.directionLabels[field][dir].toLowerCase()}`;
    return '';
  }

  /** Whether a dimension still holds the value it starts on. */
  function untouched(which: string | undefined) {
    if (which === 'order') return field === 'default' && dir === 'desc';
    return (which === 'kind' ? kind : status) === 'all';
  }

  function visible(item: HTMLElement) {
    if (kind !== 'all' && item.dataset.kind !== kind) return false;
    if (status === 'active' && item.dataset.active !== 'true') return false;
    if (status === 'archived' && item.dataset.active === 'true') return false;
    return true;
  }

  /**
   * What a screen reader hears once the list has settled. It says the same
   * things the chips say, so the announcement and the visible state cannot
   * describe the list differently. Naming the order as well as the filters is
   * what makes reordering audible: the count alone does not move when the list
   * is only resorted, and an unchanged live region stays silent.
   */
  function announcement(count: number) {
    // The empty case borrows the wording the page itself shows, so the two
    // cannot drift apart.
    if (count === 0) return empty[0]?.textContent?.trim() ?? copy.projects.filters.empty;

    const clauses = [
      count === items.length
        ? copy.projects.filters.announcements.all(items.length)
        : copy.projects.filters.announcements.some(count, items.length),
    ];

    for (const clause of FILTER_CLAUSES) {
      if (untouched(clause.key)) continue;
      // "Order is date, newest first" is how the chip reads, but spoken aloud
      // it wants a verb.
      clauses.push(
        clause.key === 'order'
          ? copy.projects.filters.announcements.order(echo('order').toLowerCase())
          : copy.projects.filters.announcements.filter(
              copy.projects.filters.clauseLabels[clause.key].toLowerCase(),
              echo(clause.key).toLowerCase(),
            ),
      );
    }

    return `${clauses.join(', ')}.`;
  }

  function apply({ animate = true, announce = true } = {}) {
    const before = new Map(items.map((item) => [item, item.getBoundingClientRect().top]));

    const ordered = items
      .filter(visible)
      .sort((a, b) => compareRanked(rank(a), rank(b), field, dir, locale));

    for (const item of items) item.hidden = !visible(item);
    for (const item of ordered) projectList.appendChild(item);

    root.dataset.stateField = field;
    root.dataset.stateDir = dir;
    root.dataset.stateKind = kind;
    root.dataset.stateStatus = status;

    // A project page reads this back to work out which project comes after the
    // one being read, so it is written on every pass rather than only on a
    // change: what is stored is then always what the list is showing.
    writeProjectState({ field, direction: dir, kind, status });

    for (const node of setStatus) check(node, status === node.dataset.setStatus);
    for (const node of setKind) check(node, kind === node.dataset.setKind);
    for (const node of setSort) check(node, field === node.dataset.setSort);
    for (const node of setDir) check(node, dir === node.dataset.setDir);
    for (const node of dirNames)
      node.textContent = copy.projects.filters.directionLabels[field][node.dataset.dirName as SortDirection];
    for (const node of echoes) node.textContent = echo(node.dataset.echo ?? '');
    // A clause is only worth printing once its dimension has been moved off the
    // value it holds by default.
    for (const node of chips) node.hidden = untouched(node.dataset.chip);
    for (const node of empty) node.hidden = ordered.length > 0;
    // The first pass only mirrors what the page already shows, so it has
    // nothing to report; announcing there would talk over the page load.
    if (announce) for (const node of announcers) node.textContent = announcement(ordered.length);

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
      status = node.dataset.setStatus as ProjectStatus;
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
      dir = node.dataset.setDir as SortDirection;
      apply();
    });

  for (const node of clears)
    node.addEventListener('click', () => {
      const which = node.dataset.clear;
      // Every dimension goes back to its default, and the order has one too.
      if (which === 'order') {
        field = 'default';
        dir = 'desc';
      } else {
        if (which !== 'kind') status = 'all';
        if (which !== 'status') kind = 'all';
      }
      apply();
    });

  root.dataset.ready = 'true';
  apply({ animate: false, announce: false });
}
