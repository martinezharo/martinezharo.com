import type { Locale } from '../../i18n';
import type { ServiceKey } from '../hire/model';

export const MOCKUPS = ['configurador', 'tallas', 'cartel'] as const;
export type Mockup = (typeof MOCKUPS)[number];

/** Short copy for the hire mockups: one line per service, a few chips, nothing more. */
export function mockCopy(locale: Locale) {
  const es = locale === 'es';
  return {
    lines: {
      webApp: es ? 'Tu idea convertida en una app online, con dominio y hosting.' : 'Your idea as a live app, with domain and hosting.',
      landing: es ? 'Una página que convierte visitas en clientes.' : 'One page that turns visits into clients.',
      redesign: es ? 'Tu web, más clara, coherente y agradable de usar.' : 'Your site, clearer, consistent and nicer to use.',
    } satisfies Record<ServiceKey, string>,
    chips: {
      webApp: es ? ['Hosting gratis', 'Tu dominio', 'Código en tu GitHub'] : ['Free hosting', 'Your domain', 'Code on your GitHub'],
      landing: es ? ['Diseño original', 'Rápida y accesible', 'Hosting gratis'] : ['Original design', 'Fast and accessible', 'Free hosting'],
      redesign: es ? ['En tu propio código', 'Responsive', 'Cualquier stack'] : ['In your own code', 'Responsive', 'Any stack'],
    } satisfies Record<ServiceKey, string[]>,
    pick: es ? '¿Qué necesitas?' : 'What do you need?',
    size: es ? 'Elige el tamaño' : 'Pick a size',
    delivery: es ? 'Entrega' : 'Delivery',
    days: (n: number) => (es ? `${n} días` : `${n} days`),
    revisions: (n: number) => (es ? `${n} ${n === 1 ? 'revisión' : 'revisiones'}` : `${n} revision${n === 1 ? '' : 's'}`),
    from: es ? 'desde' : 'from',
    note: es ? 'Precios orientativos. Cada proyecto es único: te doy un precio cerrado antes de empezar.' : 'Indicative prices. Every project is different: you get a fixed quote before I start.',
    ask: es ? 'Pedir presupuesto' : 'Get a quote',
    scaleTitle: es ? 'Lo que costarían mis proyectos' : 'What my projects would cost',
    scaleLine: es ? 'Si hoy me los encargara un cliente.' : 'If a client ordered them today.',
    sizes: { basic: 'S', standard: 'M', premium: 'L' } as const,
  };
}
