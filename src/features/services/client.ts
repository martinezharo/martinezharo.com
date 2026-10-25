/**
 * The contact form in the browser: put the Turnstile check in place, send the
 * fields to /api/contact and say how it went in the form's own status line.
 */

interface Turnstile {
  render(container: HTMLElement, options: Record<string, unknown>): string | undefined;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

type Messages = Record<'sending' | 'sent' | 'invalid' | 'challenge' | 'unavailable', string>;

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<Turnstile> | null = null;

/** The script is fetched the first time a form needs it and kept for the document's life. */
function loadTurnstile(): Promise<Turnstile> {
  loading ??= new Promise<Turnstile>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.addEventListener('load', () => (window.turnstile ? resolve(window.turnstile) : reject()));
    script.addEventListener('error', () => {
      loading = null;
      script.remove();
      reject();
    });
    document.head.appendChild(script);
  });
  return loading;
}

export function initContactForm(form: HTMLFormElement | null, signal: AbortSignal): void {
  if (!form) return;

  const messages = JSON.parse(form.dataset.messages ?? '{}') as Messages;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const challenge = form.querySelector<HTMLElement>('[data-turnstile]')!;
  let token = '';
  let widget: string | undefined;

  const say = (text: string, tone: 'info' | 'success' | 'error' = 'info') => {
    status.textContent = text;
    status.dataset.tone = tone;
  };

  // The message box grows with its text. CSS does it where field-sizing is
  // supported; elsewhere its height follows the text's on every keystroke.
  const textarea = form.querySelector<HTMLTextAreaElement>('textarea')!;
  const grow = CSS.supports('field-sizing', 'content')
    ? () => {}
    : () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + textarea.offsetHeight - textarea.clientHeight}px`;
      };
  textarea.addEventListener('input', grow, { signal });

  // The button waits for a token: a message sent without one is refused.
  const ready = () => {
    submit.disabled = token === '';
  };

  loadTurnstile()
    .then((turnstile) => {
      if (signal.aborted) return;
      widget = turnstile.render(challenge, {
        sitekey: form.dataset.siteKey,
        theme: 'dark',
        appearance: 'interaction-only',
        language: form.dataset.locale,
        callback: (value: string) => {
          token = value;
          ready();
        },
        'expired-callback': () => {
          token = '';
          ready();
        },
        'error-callback': () => {
          token = '';
          ready();
          say(messages.challenge, 'error');
        },
      });
      signal.addEventListener('abort', () => widget && turnstile.remove(widget), { once: true });
    })
    .catch(() => say(messages.unavailable, 'error'));

  form.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();
      // Native validation popups can keep reopening while an invalid field is
      // edited. Report errors in the status line only on a submission attempt.
      if (!form.checkValidity()) {
        form.querySelector<HTMLElement>(':invalid')?.focus();
        return say(messages.invalid, 'error');
      }
      if (!token) return say(messages.challenge, 'error');

      submit.disabled = true;
      form.setAttribute('aria-busy', 'true');
      say(messages.sending);

      let error: keyof Messages | null = 'unavailable';
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
          signal,
        });
        const result = (await response.json()) as { ok: boolean; error?: keyof Messages };
        error = result.ok ? null : (result.error ?? 'unavailable');
      } catch {
        if (signal.aborted) return;
      }

      form.removeAttribute('aria-busy');
      if (error) {
        say(messages[error] ?? messages.unavailable, 'error');
      } else {
        form.reset();
        grow();
        form.dataset.state = 'sent';
        say(messages.sent, 'success');
      }

      // A token is good for one check, so each attempt needs a fresh one.
      token = '';
      ready();
      if (widget) window.turnstile?.reset(widget);
    },
    { signal },
  );
}
