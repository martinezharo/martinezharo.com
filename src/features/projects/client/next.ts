import type { NextCandidate } from '../next-project';
import { nextProject } from '../ordering';
import { readProjectState } from '../state-store';
import { isLocale, localizedPath, type Locale } from '../../../i18n';

// Points the foot of a story at the project the visitor's own list would have
// shown next. The server already drew the link for the order the list starts
// in, so this only has something to do when the visitor changed that order —
// and when they did not, or when nothing was stored, it leaves the page alone
// rather than redrawing it with the same answer.

function text(root: HTMLElement, selector: string, value: string) {
  const node = root.querySelector<HTMLElement>(selector);
  if (node) node.textContent = value;
}

export function initNextProject(root: HTMLElement | null): void {
  if (!root) return;

  const slug = root.dataset.slug;
  const state = readProjectState();
  const data = document.querySelector('[data-projects]')?.textContent;
  if (!slug || !state || !data) return;

  let candidates: NextCandidate[];
  try {
    candidates = JSON.parse(data) as NextCandidate[];
  } catch {
    return;
  }

  const locale: Locale = isLocale(root.dataset.locale) ? root.dataset.locale : 'en';
  const next = nextProject(candidates, slug, state, locale);

  // Under the visitor's own order this may be the last project even though it
  // was not under the default one, and then there is nothing to point at.
  root.hidden = next === null;
  if (!next) return;

  const link = root.querySelector<HTMLAnchorElement>('[data-next-link]');
  const logo = root.querySelector<HTMLImageElement>('[data-next-logo]');
  if (link) link.href = localizedPath(locale, `/projects/${next.slug}`);
  if (logo) logo.src = next.logo;
  text(root, '[data-next-name]', next.name);
  text(root, '[data-next-blurb]', next.blurb);
}
