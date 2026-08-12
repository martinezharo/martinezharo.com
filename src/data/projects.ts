// Los proyectos y sus fechas/descripciones salen de la D1 real (`oliweb`).
// Las puntuaciones, el tipo y el stack son inventados para la maqueta: sirven
// para probar la densidad de la tarjeta y el comportamiento de filtros/orden.

export type ProjectKind = 'ecommerce' | 'marketplace' | 'app' | 'tool' | 'brand';

export interface Project {
  slug: string;
  name: string;
  active: boolean;
  /** Año de inicio. `end` a null = sigue vivo. */
  start: number;
  end: number | null;
  kind: ProjectKind;
  url: string | null;
  logo: string;
  /** Descripción corta para la tarjeta (la larga vive en la vista de detalle). */
  blurb: string;
  scores: {
    /** Craft — nivel de acabado de la interfaz: composición, detalle, pulido. */
    craft: number;
    /** Depth — complejidad técnica: arquitectura, integraciones, casos límite. */
    depth: number;
    /** Utility — cuánto resuelve de verdad a quien lo usa. */
    utility: number;
    /** Impact — resultados medibles: ventas, tráfico, adopción. */
    impact: number;
  };
  /** Effort — horas invertidas hasta hoy. */
  hours: number;
  stack: string[];
}

export const KIND_LABEL: Record<ProjectKind, string> = {
  ecommerce: 'E-commerce',
  marketplace: 'Marketplace',
  app: 'App',
  tool: 'Tool',
  brand: 'Brand',
};

/** Explicación de cada métrica, para tooltips y leyendas. */
export const SCORE_META = [
  { key: 'craft', label: 'Craft', hint: 'Interface finish: composition, detail and interaction.' },
  { key: 'depth', label: 'Depth', hint: 'Technical complexity: architecture, integrations and edge cases.' },
  { key: 'utility', label: 'Utility', hint: 'How much the project solves for the people who use it.' },
  { key: 'impact', label: 'Impact', hint: 'Measurable results: sales, traffic and adoption.' },
] as const;

export type ScoreKey = (typeof SCORE_META)[number]['key'];

export const projects: Project[] = [
  {
    slug: 'octopus-control',
    name: 'Octopus Control',
    active: true,
    start: 2024,
    end: null,
    kind: 'ecommerce',
    url: 'https://octopuscontrol.com',
    logo: '/imgs/projects/octopus-control.svg',
    blurb: 'A remote-control shop with a 4,000-item catalogue and a model-first search experience.',
    scores: { craft: 88, depth: 82, utility: 94, impact: 97 },
    hours: 2100,
    stack: ['Astro', 'Workers', 'D1', 'Stripe'],
  },
  {
    slug: 'fewya',
    name: 'Fewya',
    active: true,
    start: 2026,
    end: null,
    kind: 'marketplace',
    url: 'https://fewya.com',
    logo: '/imgs/projects/fewya-logo.svg',
    blurb: 'A marketplace for new goods, built around verified professional sellers.',
    scores: { craft: 92, depth: 95, utility: 86, impact: 61 },
    hours: 1400,
    stack: ['Astro', 'Workers', 'D1', 'R2', 'Queues'],
  },
  {
    slug: 'klipcode',
    name: 'KlipCode',
    active: true,
    start: 2026,
    end: null,
    kind: 'app',
    url: 'https://klipcode.com',
    logo: '/imgs/projects/klipcode.png',
    blurb: 'A local-first snippet manager with nested folders and optional cloud sync.',
    scores: { craft: 94, depth: 74, utility: 88, impact: 48 },
    hours: 520,
    stack: ['React', 'IndexedDB', 'Workers'],
  },
  {
    slug: 'rankmaker',
    name: 'RANKMAKER',
    active: true,
    start: 2025,
    end: null,
    kind: 'app',
    url: 'https://rankmaker.net',
    logo: '/imgs/projects/rankmaker-logo.webp',
    blurb: 'Collaborative rankings built one choice at a time, every vote reshaping the table.',
    scores: { craft: 86, depth: 79, utility: 81, impact: 72 },
    hours: 760,
    stack: ['Astro', 'Durable Objects', 'D1'],
  },
  {
    slug: 'oliverp',
    name: 'OlivERP',
    active: true,
    start: 2025,
    end: null,
    kind: 'tool',
    url: 'https://github.com/martinezharo/erp',
    logo: '/imgs/projects/oliverp-logo.webp',
    blurb: 'The ERP I run my own businesses on: stock, orders, invoicing and margins.',
    scores: { craft: 71, depth: 90, utility: 96, impact: 68 },
    hours: 980,
    stack: ['React', 'Workers', 'D1', 'Hyperdrive'],
  },
  {
    slug: 'goal-partner',
    name: 'Goal: Partner.',
    active: false,
    start: 2025,
    end: 2025,
    kind: 'app',
    url: 'https://goalpartner.4oli.com',
    logo: '/imgs/projects/goal-partner-logo.webp',
    blurb: 'A short-lived dating experiment built without engagement tricks or paywalls.',
    scores: { craft: 74, depth: 66, utility: 42, impact: 21 },
    hours: 240,
    stack: ['Astro', 'Workers', 'KV'],
  },
  {
    slug: 'elitebara',
    name: 'EliteBara',
    active: false,
    start: 2023,
    end: 2023,
    kind: 'ecommerce',
    url: null,
    logo: '/imgs/projects/elitebara-logo.webp',
    blurb: 'A capybara clothing shop, and my first serious encounter with logistics and returns.',
    scores: { craft: 63, depth: 48, utility: 55, impact: 34 },
    hours: 310,
    stack: ['Shopify', 'Liquid'],
  },
  {
    slug: 'kenobismo',
    name: 'Kenobismo',
    active: false,
    start: 2020,
    end: 2023,
    kind: 'brand',
    url: 'https://www.instagram.com/kenobismo/',
    logo: '/imgs/projects/kenobismo-logo.webp',
    blurb: 'A Star Wars and film project: three years of daily publishing, 120,000 followers.',
    scores: { craft: 58, depth: 22, utility: 60, impact: 77 },
    hours: 1500,
    stack: ['Contenido', 'Community'],
  },
];

/** Media de las cuatro métricas, redondeada. Se usa como puntuación global. */
export const overall = (p: Project) =>
  Math.round((p.scores.craft + p.scores.depth + p.scores.utility + p.scores.impact) / 4);

/** «2024 —», «2020–2023» o «2023», según lo que aporte información. */
export const range = (p: Project) => {
  if (!p.end) return `${p.start} —`;
  return p.end === p.start ? `${p.start}` : `${p.start}–${p.end}`;
};

export const kinds = [...new Set(projects.map((p) => p.kind))] as ProjectKind[];
