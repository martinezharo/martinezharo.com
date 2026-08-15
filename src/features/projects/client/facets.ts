// The menu behind the filter button on the project list. Only the menu: what a
// value does once it is picked still belongs to the controls module, which
// reads the [data-set-*] attributes on the items in here.
//
// It is one list of fields, each opening a list of its values, with a search
// over both — so "act" finds Status and says it was Active that matched. Every
// row is a button, the flyouts open to the left because the button sits at the
// right edge of the column, and on a phone they unfold inline instead.

interface Facet {
  root: HTMLElement;
  row: HTMLButtonElement;
  sub: HTMLElement;
  items: HTMLButtonElement[];
  name: HTMLElement;
  hit: HTMLElement | null;
}

export function initProjectFacets(root: HTMLElement): void {
  const wrap = root.querySelector<HTMLElement>('[data-facets]');
  const button = root.querySelector<HTMLButtonElement>('[data-facets-button]');
  const menu = root.querySelector<HTMLElement>('[data-facets-menu]');
  const search = root.querySelector<HTMLInputElement>('[data-facets-search]');
  const empty = root.querySelector<HTMLElement>('[data-facets-empty]');
  if (!wrap || !button || !menu) return;

  // Keep non-null aliases for callbacks that run after this initializer exits.
  const toggle = button;
  const panel = menu;

  const facets: Facet[] = Array.from(panel.querySelectorAll<HTMLElement>('[data-facet]')).map((node) => {
    const row = node.querySelector<HTMLButtonElement>('[data-facet-row]')!;
    const sub = node.querySelector<HTMLElement>('[data-facet-sub]')!;
    const items = Array.from(sub.querySelectorAll<HTMLButtonElement>('button'));
    return {
      root: node,
      row,
      sub,
      items,
      name: node.querySelector<HTMLElement>('[data-facet-name]')!,
      hit: node.querySelector<HTMLElement>('[data-facet-hit]'),
    };
  });

  // Read off the DOM at search time rather than cached: the two directions are
  // renamed with the field they order, so "highest first" is only there while
  // the order is a rating. It is the name of the value that is wanted, not the
  // count printed under it, so the name has an element of its own.
  const label = (node: HTMLElement) =>
    (node.querySelector<HTMLElement>('[data-option-label]') ?? node).textContent!.trim();

  const visible = () => facets.filter((facet) => !facet.root.hidden);

  function closeSubs(except?: Facet) {
    for (const facet of facets) {
      if (facet === except) continue;
      facet.sub.hidden = true;
      facet.row.setAttribute('aria-expanded', 'false');
    }
  }

  function openSub(facet: Facet, focus = true) {
    closeSubs(facet);
    facet.sub.hidden = false;
    facet.row.setAttribute('aria-expanded', 'true');
    if (focus) (facet.items.find((item) => item.getAttribute('aria-checked') === 'true') ?? facet.items[0])?.focus();
  }

  function open(facet?: string) {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    const wanted = facet ? facets.find((item) => item.root.dataset.facet === facet) : undefined;
    if (wanted) openSub(wanted);
    else search?.focus();
  }

  function close({ restore = true } = {}) {
    if (panel.hidden) return;
    closeSubs();
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (search) {
      search.value = '';
      filter('');
    }
    if (restore) toggle.focus();
  }

  /** Rows survive on their own name or on any of their values; a row kept by a
      value says which one, so the search never hides its own reason. */
  function filter(query: string) {
    const needle = query.trim().toLowerCase();
    for (const facet of facets) {
      const named = label(facet.name).toLowerCase().includes(needle);
      const value = facet.items.find((item) => label(item).toLowerCase().includes(needle));
      facet.root.hidden = needle !== '' && !named && !value;
      if (facet.hit) {
        const show = needle !== '' && !named && !!value;
        facet.hit.hidden = !show;
        facet.hit.textContent = show ? label(value!) : '';
      }
    }
    if (empty) empty.hidden = visible().length > 0;
  }

  function move(from: Facet, step: number) {
    const rows = visible();
    const next = rows[(rows.indexOf(from) + step + rows.length) % rows.length];
    next?.row.focus();
  }

  toggle.addEventListener('click', () => (panel.hidden ? open() : close()));
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open();
    }
  });

  search?.addEventListener('input', () => {
    // Whatever was open belonged to the list as it was a keystroke ago.
    closeSubs();
    filter(search.value);
  });
  search?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      visible()[0]?.row.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  });

  for (const facet of facets) {
    facet.row.addEventListener('click', () => {
      if (facet.sub.hidden) openSub(facet);
      else closeSubs();
    });
    facet.row.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          move(facet, 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          move(facet, -1);
          break;
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          event.preventDefault();
          openSub(facet);
          break;
        case 'Escape':
          event.preventDefault();
          close();
          break;
      }
    });

    facet.items.forEach((item, index) => {
      // Picking a value applies it and closes: the menu is a question, and it
      // has been answered.
      item.addEventListener('click', () => close({ restore: false }));
      item.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            facet.items[(index + 1) % facet.items.length]?.focus();
            break;
          case 'ArrowUp':
            event.preventDefault();
            facet.items[(index - 1 + facet.items.length) % facet.items.length]?.focus();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            closeSubs();
            facet.row.focus();
            break;
          case 'Escape':
            event.preventDefault();
            close();
            break;
        }
      });
    });
  }

  // A clause is a way back into the menu: pressing one opens the field it was
  // made from, with its values already showing.
  for (const opener of root.querySelectorAll<HTMLButtonElement>('[data-facets-open]'))
    opener.addEventListener('click', () => open(opener.dataset.facetsOpen));

  document.addEventListener('pointerdown', (event) => {
    if (!wrap.contains(event.target as Node) && !(event.target as HTMLElement).closest('[data-facets-open]'))
      close({ restore: false });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}
