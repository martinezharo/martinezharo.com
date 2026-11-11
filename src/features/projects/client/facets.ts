// The menu behind the filter button on the project list. Only the menu: what a
// value does once it is picked still belongs to the controls module, which
// reads the [data-set-*] attributes on the items in here.
//
// It is one short list of fields, each opening a list of its values. Every row
// is a button, the flyouts open to the left because the button sits at the
// right edge of the column, and on a phone they unfold inline instead.

interface Facet {
  root: HTMLElement;
  row: HTMLButtonElement;
  sub: HTMLElement;
  items: HTMLButtonElement[];
}

export function initProjectFacets(root: HTMLElement, signal: AbortSignal): void {
  const wrap = root.querySelector<HTMLElement>('[data-facets]');
  const button = root.querySelector<HTMLButtonElement>('[data-facets-button]');
  const menu = root.querySelector<HTMLElement>('[data-facets-menu]');
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
    };
  });

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
    else facets[0]?.row.focus();
  }

  function close({ restore = true } = {}) {
    if (panel.hidden) return;
    closeSubs();
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (restore) toggle.focus();
  }

  function move(from: Facet, step: number) {
    facets[(facets.indexOf(from) + step + facets.length) % facets.length]?.row.focus();
  }

  toggle.addEventListener('click', () => (panel.hidden ? open() : close()));
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open();
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

  // These two are the only listeners that outlive the menu's own markup, so
  // they are the only ones the client router can leave behind: it keeps one
  // document across navigations, and without the signal every return to the
  // list would stack another pair on top of the last, each still holding a
  // menu that has since been swapped away.
  document.addEventListener('pointerdown', (event) => {
    if (!wrap.contains(event.target as Node) && !(event.target as HTMLElement).closest('[data-facets-open]'))
      close({ restore: false });
  }, { signal });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  }, { signal });
}
