import { initProjectControls } from './controls';
import { initProjectFacets } from './facets';
import { initProjectLegend } from './legend';

/** The signal lasts as long as this page does: see the note in `facets`. */
export function initProjectShowcase(root: HTMLElement | null, signal: AbortSignal): void {
  if (!root) return;

  initProjectControls(root);
  initProjectFacets(root, signal);
  initProjectLegend(root);
}
