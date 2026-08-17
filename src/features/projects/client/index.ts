import { initProjectControls } from './controls';
import { initProjectFacets } from './facets';
import { initProjectLegend } from './legend';

export function initProjectShowcase(root: HTMLElement | null): void {
  if (!root) return;

  initProjectControls(root);
  initProjectFacets(root);
  initProjectLegend(root);
}
