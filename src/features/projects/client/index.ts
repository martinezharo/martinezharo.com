import { initProjectControls } from './controls';
import { initProjectFacets } from './facets';

export function initProjectShowcase(root: HTMLElement | null): void {
  if (!root) return;

  initProjectControls(root);
  initProjectFacets(root);
}
