const GLYPHS = 'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNOPQRSTUVWXYZ';
const FRAME_MS = 45;

const escape = (text: string) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Rewrites an element's text into `to`, one letter at a time from left to
 * right. Each letter holds its old character, flickers through random ones
 * for a moment and then lands on the new one, so the sentence reads as being
 * translated in place rather than replaced.
 */
export function decode(element: HTMLElement, to: string, { delay = 0, duration = 1000 } = {}): Promise<void> {
  const from = element.textContent ?? '';
  const length = Math.max(from.length, to.length);
  const lands = Array.from({ length }, (_, index) => (index / length) * 0.7 + Math.random() * 0.3);
  const starts = lands.map((land) => Math.max(0, land - 0.32));
  const glyphs = Array.from({ length }, randomGlyph);

  return new Promise((resolve) => {
    let begin = 0;
    let lastShuffle = 0;
    const frame = (now: number) => {
      begin ||= now;
      const progress = Math.min(1, (now - begin) / duration);
      if (now - lastShuffle > FRAME_MS) {
        lastShuffle = now;
        for (let index = 0; index < length; index += 1) glyphs[index] = randomGlyph();
      }
      let html = '';
      for (let index = 0; index < length; index += 1) {
        if (progress >= lands[index]) html += escape(to[index] ?? '');
        else if (progress >= starts[index]) html += `<span class="ls-glyph">${glyphs[index]}</span>`;
        else html += escape(from[index] ?? '');
      }
      element.innerHTML = html;
      if (progress < 1) requestAnimationFrame(frame);
      else { element.textContent = to; resolve(); }
    };
    setTimeout(() => requestAnimationFrame(frame), delay);
  });
}
