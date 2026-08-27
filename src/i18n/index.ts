import type {
  ProjectKind,
  ProjectStatus,
  ScoreKey,
  SortDirection,
  SortField,
} from '../features/projects/model';

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * How the switcher states a choice, and where that choice is kept.
 *
 * The root negotiates, so a Spanish reader asking for English at `/` would be
 * sent straight back to `/es` and the switch would look broken. The link asks
 * for the language out loud; the middleware records it and drops the query, so
 * the address bar keeps the clean URL and later visits to `/` obey the choice
 * instead of the browser's header.
 */
export const LOCALE_QUERY = 'lang';
export const LOCALE_COOKIE = 'locale';

/** Each language named in itself, for the switcher. */
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', es: 'Español' };

export interface MetricCopy {
  label: string;
  hint: string;
}

export interface LocaleCopy {
  site: {
    title: string;
    description: string;
    intro: {
      eyebrow: string;
      heading: string;
      body: string;
    };
    availability: string;
  };
  navigation: {
    home: string;
    primary: string;
    language: string;
    projects: string;
    about: string;
    github: string;
  };
  common: {
    skipProjects: string;
    skipStory: string;
    close: string;
    builtWith: string;
    conditionIs: string;
    removeCondition(label: string): string;
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  footer: {
    prompt: string;
    link: string;
  };
  errors: {
    notFound: string;
    projectNotFound: string;
  };
  projects: {
    heading: string;
    status: Record<Exclude<ProjectStatus, 'all'>, string>;
    kindLabels: Record<ProjectKind | 'all', string>;
    metrics: Record<ScoreKey, MetricCopy>;
    meter: {
      notApplicable(label: string): string;
      rating(label: string, rating: number): string;
    };
    filters: {
      buttonLabel: string;
      buttonTitle: string;
      searchPlaceholder: string;
      searchLabel: string;
      fieldsLabel: string;
      noField: string;
      empty: string;
      fieldLabels: {
        status: string;
        kind: string;
        sort: string;
        dir: string;
      };
      clauseLabels: {
        status: string;
        kind: string;
        order: string;
      };
      statusLabels: Record<ProjectStatus, string>;
      sortLabels: Record<SortField, string>;
      directionLabels: Record<SortField, Record<SortDirection, string>>;
      projectCount(count: number): string;
      announcements: {
        all(total: number): string;
        some(count: number, total: number): string;
        filter(label: string, value: string): string;
        order(value: string): string;
      };
    };
    legend: {
      button: string;
      title: string;
      close: string;
      lede: string;
    };
  };
  detail: {
    back: string;
    linksLabel(name: string): string;
    visitSite: string;
    viewSource: string;
    storyHeading: string;
    storyNone: string;
    nextLabel: string;
    nextEyebrow: string;
  };
}

const englishDirections: Record<SortField, Record<SortDirection, string>> = {
  date: { desc: 'Newest first', asc: 'Oldest first' },
  name: { desc: 'Z to A', asc: 'A to Z' },
  overall: { desc: 'Highest first', asc: 'Lowest first' },
  design: { desc: 'Highest first', asc: 'Lowest first' },
  engineering: { desc: 'Highest first', asc: 'Lowest first' },
  value: { desc: 'Highest first', asc: 'Lowest first' },
  maturity: { desc: 'Highest first', asc: 'Lowest first' },
};

const spanishDirections: Record<SortField, Record<SortDirection, string>> = {
  date: { desc: 'Más recientes primero', asc: 'Más antiguos primero' },
  name: { desc: 'De la Z a la A', asc: 'De la A a la Z' },
  overall: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
  design: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
  engineering: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
  value: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
  maturity: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
};

const copies: Record<Locale, LocaleCopy> = {
  en: {
    site: {
      title: 'Oliver Martínez Haro — Independent maker',
      description: 'Oliver Martínez Haro builds useful software and small internet businesses.',
      intro: {
        eyebrow: 'Independent maker · Spain',
        heading: 'I need it,\nI build it.',
        body: 'Mostly software for my own businesses, plus side projects that begin with a question I cannot leave alone.',
      },
      availability: 'Around for interesting work',
    },
    navigation: {
      home: 'Home',
      primary: 'Primary navigation',
      language: 'Language',
      projects: "Things I've built",
      about: 'About',
      github: 'GitHub ↗',
    },
    common: {
      skipProjects: 'Skip to projects',
      skipStory: 'Skip to the story',
      close: 'Close',
      builtWith: 'Built with',
      conditionIs: 'is',
      removeCondition: (label) => `Remove the ${label.toLowerCase()} condition`,
    },
    about: {
      eyebrow: 'A little context',
      heading: 'I like software that stays out of the way.',
      body: 'I care about the whole thing: the idea, the awkward edge cases, the interface, the infrastructure and whether it remains pleasant after the hundredth use. Building my own tools and shops keeps that standard honest.',
    },
    footer: {
      prompt: 'Have something interesting in mind?',
      link: 'Say hello.',
    },
    errors: {
      notFound: 'Not found',
      projectNotFound: 'Project not found',
    },
    projects: {
      heading: "Things I've built",
      status: { active: 'Active', archived: 'Archived' },
      kindLabels: {
        all: 'Every type',
        ecommerce: 'E-commerce',
        marketplace: 'Marketplace',
        app: 'App',
        game: 'Game',
        brand: 'Brand',
      },
      metrics: {
        design: { label: 'Design', hint: 'How strong the interface and the experience are.' },
        engineering: {
          label: 'Engineering',
          hint: 'How technically demanding or sophisticated the project is.',
        },
        value: {
          label: 'Value',
          hint: 'How useful it is, and how meaningful the problem it solves is.',
        },
        maturity: {
          label: 'Maturity',
          hint: 'How complete, reliable, polished and ready for the real world it is.',
        },
      },
      meter: {
        notApplicable: (label) => `${label}: does not apply`,
        rating: (label, rating) => `${label}: ${rating} out of 5`,
      },
      filters: {
        buttonLabel: 'Filter and sort',
        buttonTitle: 'Filter and sort',
        searchPlaceholder: 'Search fields…',
        searchLabel: 'Search fields',
        fieldsLabel: 'Fields',
        noField: 'No field by that name.',
        empty: 'Nothing here matches those filters.',
        fieldLabels: { status: 'Status', kind: 'Type', sort: 'Order', dir: 'Direction' },
        clauseLabels: { status: 'Status', kind: 'Type', order: 'Order' },
        statusLabels: {
          all: 'Every status',
          active: 'Active',
          archived: 'Archived',
        },
        sortLabels: {
          date: 'Date',
          name: 'Name',
          overall: 'Overall rating',
          design: 'Design',
          engineering: 'Engineering',
          value: 'Value',
          maturity: 'Maturity',
        },
        directionLabels: englishDirections,
        projectCount: (count) => `${count} project${count === 1 ? '' : 's'}`,
        announcements: {
          all: (total) => `Showing all ${total} projects`,
          some: (count, total) => `Showing ${count} of ${total} projects`,
          filter: (label, value) => `${label} is ${value}`,
          order: (value) => `sorted by ${value}`,
        },
      },
      legend: {
        button: 'How the ratings work',
        title: 'How the ratings work',
        close: 'Close',
        lede: 'A project carries up to four scores, each drawn as five segments. The lit part is the score and the rest of the track stays visible, so two projects can be compared without reading a number.',
      },
    },
    detail: {
      back: 'Every project',
      linksLabel: (name) => `${name} links`,
      visitSite: 'Visit site',
      viewSource: 'View source',
      storyHeading: 'How it went',
      storyNone: 'Nothing written about this one yet.',
      nextLabel: 'Next project',
      nextEyebrow: 'Next',
    },
  },
  es: {
    site: {
      title: 'Oliver Martínez Haro — Creador independiente',
      description: 'Oliver Martínez Haro crea software útil y pequeños negocios en internet.',
      intro: {
        eyebrow: 'Creador independiente',
        heading: 'Lo necesito,\nlo construyo.',
        body: 'Sobre todo software para mis propios negocios, además de proyectos paralelos que empiezan con una pregunta que no puedo dejar sin responder.',
      },
      availability: 'Disponible para proyectos interesantes',
    },
    navigation: {
      home: 'Inicio',
      primary: 'Navegación principal',
      language: 'Idioma',
      // The nav does not reuse the section heading here: in Spanish that
      // heading fills the row on its own and pushes GitHub onto a second line.
      projects: 'Proyectos',
      about: 'Sobre mí',
      github: 'GitHub ↗',
    },
    common: {
      skipProjects: 'Saltar a los proyectos',
      skipStory: 'Saltar a la historia',
      close: 'Cerrar',
      builtWith: 'Construido con',
      conditionIs: 'es',
      removeCondition: (label) => `Quitar la condición de ${label.toLowerCase()}`,
    },
    about: {
      eyebrow: 'Un poco de contexto',
      heading: 'Me gusta el software que no se interpone.',
      body: 'Me importa todo el conjunto: la idea, los casos límite incómodos, la interfaz, la infraestructura y si sigue siendo agradable después del uso número cien. Construir mis propias herramientas y tiendas mantiene ese estándar bajo control.',
    },
    footer: {
      prompt: '¿Tienes algo interesante en mente?',
      link: 'Escríbeme.',
    },
    errors: {
      notFound: 'No encontrado',
      projectNotFound: 'Proyecto no encontrado',
    },
    projects: {
      heading: 'Cosas que he construido',
      status: { active: 'Activo', archived: 'Archivado' },
      kindLabels: {
        all: 'Todos los tipos',
        ecommerce: 'Comercio electrónico',
        marketplace: 'Marketplace',
        app: 'Aplicación',
        game: 'Videojuego',
        brand: 'Marca',
      },
      metrics: {
        design: {
          label: 'Diseño',
          hint: 'Qué tan buenas son la interfaz y la experiencia de uso.',
        },
        engineering: {
          // "Ingeniería" rather than "Técnica": it names the discipline the
          // hint describes, and it stays within a word of the other three,
          // which is what lets them sit in one row of the card.
          label: 'Ingeniería',
          hint: 'Qué tan exigente o sofisticado es el proyecto a nivel técnico.',
        },
        value: {
          label: 'Valor',
          hint: 'Qué tan útil es y qué tan relevante es el problema que resuelve.',
        },
        maturity: {
          label: 'Madurez',
          hint: 'Qué tan completo, fiable, pulido y listo para el mundo real está.',
        },
      },
      meter: {
        notApplicable: (label) => `${label}: no se aplica`,
        rating: (label, rating) => `${label}: ${rating} de 5`,
      },
      filters: {
        buttonLabel: 'Filtrar y ordenar',
        buttonTitle: 'Filtrar y ordenar',
        searchPlaceholder: 'Buscar campos…',
        searchLabel: 'Buscar campos',
        fieldsLabel: 'Campos',
        noField: 'Ningún campo con ese nombre.',
        empty: 'Ningún proyecto coincide con esos filtros.',
        fieldLabels: { status: 'Estado', kind: 'Tipo', sort: 'Orden', dir: 'Dirección' },
        clauseLabels: { status: 'Estado', kind: 'Tipo', order: 'Orden' },
        statusLabels: {
          all: 'Todos los estados',
          active: 'Activo',
          archived: 'Archivado',
        },
        sortLabels: {
          date: 'Fecha',
          name: 'Nombre',
          overall: 'Valoración general',
          design: 'Diseño',
          engineering: 'Ingeniería',
          value: 'Valor',
          maturity: 'Madurez',
        },
        directionLabels: spanishDirections,
        projectCount: (count) => `${count} proyecto${count === 1 ? '' : 's'}`,
        announcements: {
          all: (total) => `Mostrando los ${total} proyectos`,
          some: (count, total) => `Mostrando ${count} de ${total} proyectos`,
          filter: (label, value) => `${label}: ${value}`,
          order: (value) => `ordenados por ${value}`,
        },
      },
      legend: {
        button: 'Cómo funcionan las valoraciones',
        title: 'Cómo funcionan las valoraciones',
        close: 'Cerrar',
        lede: 'Cada proyecto tiene hasta cuatro valoraciones, representadas por cinco segmentos. La parte iluminada es la puntuación y el resto de la escala permanece visible, para poder comparar dos proyectos sin leer un número.',
      },
    },
    detail: {
      back: 'Todos los proyectos',
      linksLabel: (name) => `Enlaces de ${name}`,
      visitSite: 'Visitar sitio',
      viewSource: 'Ver código fuente',
      storyHeading: 'Cómo fue',
      storyNone: 'Todavía no hay nada escrito sobre este proyecto.',
      nextLabel: 'Siguiente proyecto',
      nextEyebrow: 'Siguiente',
    },
  },
};

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'es';
}

export function getCopy(locale: Locale): LocaleCopy {
  return copies[locale];
}

/**
 * Whether a first path segment is a locale that actually carries a prefix.
 *
 * English is the canonical language and is served unprefixed at the root, so
 * `/en/...` is deliberately not a route: the middleware sends it to its
 * unprefixed twin so the two never both answer for the same page.
 */
export function isPrefixedLocale(value: string | undefined): value is Locale {
  return value === 'es';
}

/** The locale-free route behind a path: `/es/projects/x` and `/projects/x` share `/projects/x`. */
export function routeFromPath(pathname: string): string {
  if (pathname === '/es') return '/';
  if (pathname.startsWith('/es/')) return pathname.slice(3);
  return pathname;
}

/** The language a page offers as its way out. With two locales there is only one. */
export function alternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

/** Prefix a route with the Spanish locale while keeping English canonical. */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return normalized || '/';
  return normalized === '/' ? '/es' : `/es${normalized}`;
}

/** Pick the best supported language from the browser's ordered preference list. */
export function preferredLocale(acceptLanguage: string | null): Locale {
  const preferences = (acceptLanguage ?? '')
    .split(',')
    .map((part, index) => {
      const [range, ...parameters] = part.trim().toLowerCase().split(';');
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return { range: range?.trim() ?? '', quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(({ range, quality }) => range !== '' && quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index);

  for (const preference of preferences) {
    const primary = preference.range.split('-')[0];
    if (primary === 'es') return 'es';
    if (primary === 'en') return 'en';
  }

  return DEFAULT_LOCALE;
}
