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
  app: 'Aplicación',
  tool: 'Herramienta',
  brand: 'Marca',
};

/** Explicación de cada métrica, para tooltips y leyendas. */
export const SCORE_META = [
  { key: 'craft', label: 'Craft', hint: 'Acabado de la interfaz: composición, detalle e interacción.' },
  { key: 'depth', label: 'Depth', hint: 'Complejidad técnica: arquitectura, integraciones y casos límite.' },
  { key: 'utility', label: 'Utility', hint: 'Cuánto resuelve de verdad a quien lo usa a diario.' },
  { key: 'impact', label: 'Impact', hint: 'Resultados medibles: ventas, tráfico y adopción.' },
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
    blurb: 'Tienda de mandos a distancia para televisores y streaming. Catálogo de 4.000 referencias con buscador por modelo.',
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
    blurb: 'Marketplace de producto nuevo con vendedores profesionales verificados. Alta de catálogo en menos de diez minutos.',
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
    blurb: 'Gestor de snippets con carpetas jerárquicas, local primero y sincronización opcional en la nube.',
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
    blurb: 'Rankings colaborativos construidos a base de duelos 1 contra 1. Cada voto reordena la tabla en tiempo real.',
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
    blurb: 'El ERP con el que llevo mis propios negocios: stock, pedidos, facturación y márgenes en una sola pantalla.',
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
    blurb: 'Plataforma de citas de vida muy corta, con una premisa honesta: sin métricas de enganche ni muros de pago.',
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
    blurb: 'Tienda de ropa con temática de capibaras. Primer contacto serio con logística y devoluciones.',
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
    blurb: 'Proyecto de contenido sobre Star Wars y cine. Tres años publicando a diario y 120.000 seguidores.',
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
