// The ratings legend at the foot of the project list. A native <dialog> already
// traps focus, closes on Escape and restores focus to the opener, so this only
// wires the two buttons and the click that lands outside the panel.

export function initProjectLegend(root: HTMLElement): void {
  const dialog = root.querySelector<HTMLDialogElement>('[data-legend]');
  const opener = root.querySelector<HTMLButtonElement>('[data-legend-open]');
  if (!dialog || !opener) return;

  opener.addEventListener('click', () => dialog.showModal());

  for (const close of dialog.querySelectorAll<HTMLButtonElement>('[data-legend-close]'))
    close.addEventListener('click', () => dialog.close());

  // The body fills the dialog, so the element itself is only ever the backdrop.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
