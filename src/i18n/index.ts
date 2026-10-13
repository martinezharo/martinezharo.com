import type {
  ProjectKind,
  ProjectStatus,
  ScoreKey,
  SortDirection,
  SortField,
} from '../features/projects/model';
import type { CategoryKey } from '../features/stack/model';
import type { ContactError, ContactService } from '../features/hire/contact';
import type { QuoteDuration, ServiceKey, TierKey } from '../features/hire/model';

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

export interface ServiceCopy {
  name: string;
  pitch: string;
  includes: string[];
  /** What a package leaves out, said once under the packages. */
  excludes?: string;
  tiers: Record<TierKey, { name: string; description: string }>;
}

export interface HireCopy {
  title: string;
  description: string;
  intro: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  services: {
    heading: string;
    note: string;
    fiverr: string;
    includesLabel: string;
    delivery(days: number): string;
    revisions(count: number): string;
    items: Record<ServiceKey, ServiceCopy>;
  };
  quotes: {
    heading: string;
    lede: string;
    count(projects: number): string;
    duration: Record<QuoteDuration, string>;
    priceLabel(name: string, price: string): string;
  };
  contact: {
    heading: string;
    lede: string;
    name: string;
    email: string;
    service: string;
    services: Record<ContactService, string>;
    message: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    sent: string;
    errors: Record<ContactError, string>;
    /** Precedes the address, for anyone who would rather write directly. */
    direct: string;
    noscript: string;
  };
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
    /** The rail's way to the hire page, under the availability line. */
    hireCta: string;
  };
  navigation: {
    home: string;
    primary: string;
    language: string;
    stack: string;
    hire: string;
    github: string;
    /** The badge shows the mark alone, so its name has to be spoken here. */
    githubBadge: string;
  };
  common: {
    skipProjects: string;
    skipStory: string;
    skipStack: string;
    skipServices: string;
    close: string;
    builtWith: string;
    officialWebsite(name: string): string;
    conditionIs: string;
    removeCondition(label: string): string;
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  stack: {
    title: string;
    description: string;
    intro: {
      eyebrow: string;
      heading: string;
      body?: string;
    };
    heading: string;
    count(categories: number, tools: number): string;
    categories: Record<CategoryKey, string>;
  };
  footer: {
    prompt: string;
    cta: string;
  };
  hire: HireCopy;
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
  default: { desc: 'Most metrics first', asc: 'Fewest metrics first' },
  date: { desc: 'Newest first', asc: 'Oldest first' },
  span: { desc: 'Longest running first', asc: 'Shortest first' },
  name: { desc: 'Z to A', asc: 'A to Z' },
  design: { desc: 'Highest first', asc: 'Lowest first' },
  engineering: { desc: 'Highest first', asc: 'Lowest first' },
  impact: { desc: 'Highest first', asc: 'Lowest first' },
  maturity: { desc: 'Highest first', asc: 'Lowest first' },
};

const spanishDirections: Record<SortField, Record<SortDirection, string>> = {
  default: { desc: 'Más métricas primero', asc: 'Menos métricas primero' },
  date: { desc: 'Más recientes primero', asc: 'Más antiguos primero' },
  span: { desc: 'Más tiempo activos primero', asc: 'Menos tiempo activos primero' },
  name: { desc: 'De la Z a la A', asc: 'De la A a la Z' },
  design: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
  engineering: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
  impact: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
  maturity: { desc: 'Mayor puntuación primero', asc: 'Menor puntuación primero' },
};

const copies: Record<Locale, LocaleCopy> = {
  en: {
    site: {
      title: 'Oliver Martínez Haro — Software developer',
      description:
        'Oliver Martínez Haro is a software developer from Spain who builds his own tools, open-sources most of them, and keeps them running.',
      intro: {
        eyebrow: 'Software developer · Spain',
        heading: 'I need it,\nI build it.',
        body: "What I enjoy most is the interface: clean to look at and good to use. Underneath that, I'm always asking myself how to make the app faster, safer, more accessible.",
      },
      availability: 'Around for interesting work',
      hireCta: 'Services and prices →',
    },
    navigation: {
      home: 'Home',
      primary: 'Primary navigation',
      language: 'Language',
      stack: 'Stack',
      hire: 'Hire',
      github: 'GitHub ↗',
      githubBadge: 'GitHub profile (opens in a new tab)',
    },
    common: {
      skipProjects: 'Skip to projects',
      skipStory: 'Skip to the story',
      skipStack: 'Skip to the stack',
      skipServices: 'Skip to the services',
      close: 'Close',
      builtWith: 'Built with',
      officialWebsite: (name) => `Visit the official ${name} website (opens in a new tab)`,
      conditionIs: 'is',
      removeCondition: (label) => `Remove the ${label.toLowerCase()} condition`,
    },
    about: {
      eyebrow: 'A little context',
      heading: 'Hi! Oli here ☝🏻👹',
      body:
        "I'm a 22-year-old guy who's been jumping from one project to another since I was 16, always trying to create something worth building.\n\nI started out creating content for social media, then moved into e-commerce, and eventually fell in love with programming when AI started becoming a genuinely useful tool for building software.\n\nAfter managing to launch a couple of projects without even knowing what a simple `console.log` was, I decided it was finally time to learn how to code. It turned out to be one of the best decisions I've ever made.\n\nSince then, my productivity has skyrocketed, and I've started turning all those tools, websites, and ideas I'd once wished existed into projects of my own.",
    },
    stack: {
      title: 'The stack — Oliver Martínez Haro',
      description:
        'The languages, frameworks and tools Oliver Martínez Haro uses by default, category by category.',
      intro: {
        eyebrow: 'The stack',
        heading: 'What I\nbuild with.',
      },
      heading: 'Favourites, by category',
      count: (categories, tools) => `${categories} categories · ${tools} tools`,
      categories: {
        languages: 'Languages',
        frameworks: 'Frameworks',
        uiLibraries: 'UI libraries',
        cssFramework: 'CSS framework',
        backendPlatform: 'Backend platform',
        deploymentPlatform: 'Deployment platform',
        packageManager: 'Package manager',
        buildTool: 'Build tool',
        testing: 'Testing',
        ciCd: 'CI/CD',
        versionControl: 'Version control',
        codeHosting: 'Code hosting',
        codeEditor: 'Code editor',
        devEnvironment: 'Development environment',
        shell: 'Shell',
        aiAgents: 'AI coding agents',
      },
    },
    footer: {
      prompt: 'Need something built?',
      cta: "Let's talk",
    },
    hire: {
      title: 'Hire me — Oliver Martínez Haro',
      description:
        'Web apps, landing pages and interface redesigns by Oliver Martínez Haro: what each service includes, indicative prices, and a form to tell him about your project.',
      intro: {
        eyebrow: 'Work with me',
        heading: 'You need it,\nI build it.',
        body: 'Web apps, landing pages and redesigns, built around what you actually need and launched on your own domain.',
      },
      services: {
        heading: 'What I can build for you',
        note: 'Prices are indicative: every project is different. Tell me about yours and I will give you a fixed quote before starting.',
        fiverr: 'Also on Fiverr ↗',
        includesLabel: 'Always included',
        delivery: (days) => `${days} days`,
        revisions: (count) => `${count} revision${count === 1 ? '' : 's'}`,
        items: {
          webApp: {
            name: 'Web app',
            pitch: "Have an idea for a web app? Tell me what it should do, even if you're not sure about the technical details. I'll design it, build it and get it online.",
            includes: [
              'Built around your requirements, not a template',
              'Works on desktop, tablet and mobile',
              "Free hosting on Cloudflare's ongoing free plan",
              'Your domain connected (or a new one registered, +$15)',
              'The full source code, in a GitHub repository under your account',
            ],
            excludes: 'Domain renewals, paid third-party services and ongoing maintenance are not included.',
            tiers: {
              basic: {
                name: 'Mini',
                description: 'A simple web app with one core feature and up to 2 pages.',
              },
              standard: {
                name: 'Business',
                description: 'Up to 3 core features and 4 pages, with a database and content upload.',
              },
              premium: {
                name: 'Advanced',
                description: 'Up to 5 core features and 6 pages, with a database and integrations.',
              },
            },
          },
          landing: {
            name: 'Landing page',
            pitch: 'A modern landing page for a product, a launch or a business: fast, clear, unmistakably yours, and built to turn a visit into a message.',
            includes: [
              'An original design, not a theme',
              'Fast, accessible and responsive',
              "Free hosting on Cloudflare's ongoing free plan",
              'Your domain connected',
              'The full source code, in a GitHub repository under your account',
            ],
            tiers: {
              basic: {
                name: 'Essential',
                description: 'One page with up to 5 sections, ready to share.',
              },
              standard: {
                name: 'Launch',
                description: 'Up to 8 sections, custom animations, a contact form and basic SEO.',
              },
              premium: {
                name: 'Signature',
                description: 'Up to 12 sections in two languages, with analytics and performance tuning.',
              },
            },
          },
          redesign: {
            name: 'Redesign',
            pitch: 'Your site works, but the interface feels dated, inconsistent, awkward, or a little too much like AI slop. I improve it directly in your code, not in a mockup.',
            includes: [
              'Hierarchy, spacing, typography and consistency',
              'Usability and responsiveness',
              'HTML/CSS, TypeScript, React, Tailwind, Astro, Next.js and similar stacks',
            ],
            excludes: 'Backend systems, payments and API integrations are not included unless agreed separately.',
            tiers: {
              basic: {
                name: 'Refresh',
                description: 'A small part of the interface: a section, a component, a form or the navigation.',
              },
              standard: {
                name: 'Redesign',
                description: 'A larger part of the interface, with better consistency, usability and responsiveness.',
              },
              premium: {
                name: 'Overhaul',
                description: 'A complex interface, made consistent from end to end with a smoother experience.',
              },
            },
          },
        },
      },
      quotes: {
        heading: 'What my projects would cost',
        lede: 'What I would charge for each of my own projects if a client ordered it today. A sense of scale, not a price list.',
        count: (projects) => `${projects} project${projects === 1 ? '' : 's'}`,
        duration: { weeks: '1–4 weeks', months: '1–3 months' },
        priceLabel: (name, price) => `${name}: about ${price}`,
      },
      contact: {
        heading: 'Tell me about your project',
        lede: "A few lines are enough. I'll reply with questions or a quote.",
        name: 'Name',
        email: 'Email',
        service: 'What do you need?',
        services: {
          webApp: 'Web app',
          landing: 'Landing page',
          redesign: 'Redesign',
          other: 'Something else',
        },
        message: 'Your project',
        messagePlaceholder: 'What it is, who it is for, and when you would like it ready.',
        submit: 'Send',
        sending: 'Sending…',
        sent: "Thanks! Your message is on its way. I'll get back to you soon.",
        errors: {
          invalid: 'Check the fields: a name, a valid email and a few words about the project.',
          challenge: 'The spam check did not pass. Give it a moment and try again.',
          unavailable: 'The message could not be sent right now. Please write to me directly.',
        },
        direct: 'Prefer email?',
        noscript: 'The form needs JavaScript. You can write to me directly instead.',
      },
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
        impact: {
          label: 'Impact',
          hint: 'How much real-world benefit it has delivered, considering how many people it reached and how meaningfully it helped them.',
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
          default: 'Default',
          date: 'Date',
          span: 'Time active',
          name: 'Name',
          design: 'Design',
          engineering: 'Engineering',
          impact: 'Impact',
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
      title: 'Oliver Martínez Haro — Desarrollador de software',
      description:
        'Oliver Martínez Haro es un desarrollador de software de España que crea sus propias herramientas, libera su código y las mantiene en marcha.',
      intro: {
        eyebrow: 'Desarrollador · España',
        heading: 'Lo necesito,\nlo hago.',
        body: 'Lo que más disfruto son las interfaces: que se vean limpias y que dé gusto usarlas. Y por debajo, siempre me estoy preguntando cómo hacer la app más rápida, más segura, más accesible.',
      },
      availability: 'Disponible para proyectos interesantes',
      hireCta: 'Servicios y precios →',
    },
    navigation: {
      home: 'Inicio',
      primary: 'Navegación principal',
      language: 'Idioma',
      stack: 'Stack',
      hire: 'Contratar',
      github: 'GitHub ↗',
      githubBadge: 'Perfil de GitHub (se abre en una pestaña nueva)',
    },
    common: {
      skipProjects: 'Saltar a los proyectos',
      skipStory: 'Saltar a la historia',
      skipStack: 'Saltar al stack',
      skipServices: 'Saltar a los servicios',
      close: 'Cerrar',
      builtWith: 'Construido con',
      officialWebsite: (name) => `Visitar la web oficial de ${name} (se abre en una pestaña nueva)`,
      conditionIs: 'es',
      removeCondition: (label) => `Quitar la condición de ${label.toLowerCase()}`,
    },
    about: {
      eyebrow: 'Un poco de contexto',
      heading: 'Hola! Aquí Oli ☝🏻👹',
      body:
        'Soy un chico de 22 años que lleva saltando de un proyecto a otro desde los 16, siempre intentando crear algo que mereciera la pena.\n\nEmpecé creando contenido para redes sociales, después pasé por el e-commerce y terminé enamorándome de la programación cuando la IA empezó a convertirse en una herramienta útil para desarrollar software.\n\nDespués de conseguir lanzar un par de proyectos sin saber siquiera qué era un simple `console.log`, decidí que ya era hora de aprender a programar. Fue una de las mejores decisiones que he tomado.\n\nDesde entonces, mi productividad se disparó y empecé a convertir en proyectos todas esas herramientas, webs e ideas que alguna vez había echado en falta.',
    },
    stack: {
      title: 'El stack — Oliver Martínez Haro',
      description:
        'Los lenguajes, frameworks y herramientas que Oliver Martínez Haro usa por defecto, categoría por categoría.',
      intro: {
        eyebrow: 'El stack',
        heading: 'Con qué\nlo hago.',
      },
      heading: 'Favoritos, por categoría',
      count: (categories, tools) => `${categories} categorías · ${tools} herramientas`,
      categories: {
        languages: 'Lenguajes',
        frameworks: 'Frameworks',
        uiLibraries: 'Librerías de UI',
        cssFramework: 'Framework CSS',
        backendPlatform: 'Plataforma de backend',
        deploymentPlatform: 'Plataforma de despliegue',
        packageManager: 'Gestor de paquetes',
        buildTool: 'Herramienta de build',
        testing: 'Pruebas',
        ciCd: 'CI/CD',
        versionControl: 'Control de versiones',
        codeHosting: 'Alojamiento del código',
        codeEditor: 'Editor de código',
        devEnvironment: 'Entorno de desarrollo',
        shell: 'Shell',
        aiAgents: 'Agentes de IA',
      },
    },
    footer: {
      prompt: '¿Tienes algo entre manos?',
      cta: 'Hablemos',
    },
    hire: {
      title: 'Contrátame — Oliver Martínez Haro',
      description:
        'Aplicaciones web, landing pages y rediseños de interfaz de Oliver Martínez Haro: qué incluye cada servicio, precios orientativos y un formulario para contarle tu proyecto.',
      intro: {
        eyebrow: 'Trabaja conmigo',
        heading: 'Lo necesitas,\nlo hago.',
        body: 'Aplicaciones web, landing pages y rediseños, hechos a partir de lo que de verdad necesitas y publicados en tu propio dominio.',
      },
      services: {
        heading: 'Lo que puedo hacer por ti',
        note: 'Los precios son orientativos: cada proyecto es único. Cuéntame el tuyo y te daré un presupuesto cerrado antes de empezar.',
        fiverr: 'También en Fiverr ↗',
        includesLabel: 'Siempre incluido',
        delivery: (days) => `${days} días`,
        revisions: (count) => `${count} ${count === 1 ? 'revisión' : 'revisiones'}`,
        items: {
          webApp: {
            name: 'Aplicación web',
            pitch: '¿Tienes una idea para una aplicación web? Cuéntame qué debe hacer, aunque no tengas claros los detalles técnicos. Yo la diseño, la desarrollo y la pongo en marcha.',
            includes: [
              'Hecha a partir de tus requisitos, no de una plantilla',
              'Funciona en ordenador, tablet y móvil',
              'Hosting gratuito en el plan gratuito permanente de Cloudflare',
              'Tu dominio conectado (o uno nuevo registrado, +15 US$)',
              'Todo el código fuente, en un repositorio de GitHub a tu nombre',
            ],
            excludes: 'No incluye renovaciones del dominio, servicios de terceros de pago ni mantenimiento continuo.',
            tiers: {
              basic: {
                name: 'Mini',
                description: 'Una aplicación sencilla con una funcionalidad principal y hasta 2 páginas.',
              },
              standard: {
                name: 'Negocio',
                description: 'Hasta 3 funcionalidades principales y 4 páginas, con base de datos y carga de contenido.',
              },
              premium: {
                name: 'Avanzada',
                description: 'Hasta 5 funcionalidades principales y 6 páginas, con base de datos e integraciones.',
              },
            },
          },
          landing: {
            name: 'Landing page',
            pitch: 'Una landing page moderna para un producto, un lanzamiento o un negocio: rápida, clara, inconfundiblemente tuya y pensada para que una visita acabe en un mensaje.',
            includes: [
              'Un diseño original, no un tema',
              'Rápida, accesible y adaptada a cualquier pantalla',
              'Hosting gratuito en el plan gratuito permanente de Cloudflare',
              'Tu dominio conectado',
              'Todo el código fuente, en un repositorio de GitHub a tu nombre',
            ],
            tiers: {
              basic: {
                name: 'Esencial',
                description: 'Una página con hasta 5 secciones, lista para compartir.',
              },
              standard: {
                name: 'Lanzamiento',
                description: 'Hasta 8 secciones, animaciones a medida, formulario de contacto y SEO básico.',
              },
              premium: {
                name: 'A medida',
                description: 'Hasta 12 secciones en dos idiomas, con analítica y optimización del rendimiento.',
              },
            },
          },
          redesign: {
            name: 'Rediseño',
            pitch: 'Tu web funciona, pero la interfaz se ve anticuada, incoherente, incómoda o demasiado «hecha con IA». La mejoro directamente en tu código, no en un mockup.',
            includes: [
              'Jerarquía, espaciado, tipografía y coherencia',
              'Usabilidad y adaptación a cualquier pantalla',
              'HTML/CSS, TypeScript, React, Tailwind, Astro, Next.js y stacks similares',
            ],
            excludes: 'No incluye backend, pagos ni integraciones con APIs, salvo que lo acordemos aparte.',
            tiers: {
              basic: {
                name: 'Retoque',
                description: 'Una parte pequeña de la interfaz: una sección, un componente, un formulario o la navegación.',
              },
              standard: {
                name: 'Rediseño',
                description: 'Una parte grande de la interfaz, con más coherencia, usabilidad y adaptación a pantallas.',
              },
              premium: {
                name: 'Renovación',
                description: 'Una interfaz compleja, coherente de principio a fin y con una experiencia más fluida.',
              },
            },
          },
        },
      },
      quotes: {
        heading: 'Cuánto costarían mis proyectos',
        lede: 'Lo que cobraría por cada uno de mis propios proyectos si hoy me lo encargara un cliente. Una idea de la escala, no una tarifa.',
        count: (projects) => `${projects} proyecto${projects === 1 ? '' : 's'}`,
        duration: { weeks: '1–4 semanas', months: '1–3 meses' },
        priceLabel: (name, price) => `${name}: unos ${price}`,
      },
      contact: {
        heading: 'Cuéntame tu proyecto',
        lede: 'Con unas líneas basta. Te responderé con preguntas o con un presupuesto.',
        name: 'Nombre',
        email: 'Email',
        service: '¿Qué necesitas?',
        services: {
          webApp: 'Aplicación web',
          landing: 'Landing page',
          redesign: 'Rediseño',
          other: 'Otra cosa',
        },
        message: 'Tu proyecto',
        messagePlaceholder: 'Qué es, para quién es y para cuándo te gustaría tenerlo.',
        submit: 'Enviar',
        sending: 'Enviando…',
        sent: '¡Gracias! Tu mensaje está en camino. Te responderé pronto.',
        errors: {
          invalid: 'Revisa los campos: un nombre, un email válido y unas palabras sobre el proyecto.',
          challenge: 'No se ha superado la comprobación antispam. Espera un momento y vuelve a intentarlo.',
          unavailable: 'Ahora mismo no se ha podido enviar el mensaje. Escríbeme directamente, por favor.',
        },
        direct: '¿Prefieres el email?',
        noscript: 'El formulario necesita JavaScript. Puedes escribirme directamente.',
      },
    },
    errors: {
      notFound: 'No encontrado',
      projectNotFound: 'Proyecto no encontrado',
    },
    projects: {
      heading: 'Cosas que he hecho',
      status: { active: 'Activo', archived: 'Archivado' },
      kindLabels: {
        all: 'Todos los tipos',
        ecommerce: 'E-commerce',
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
        impact: {
          label: 'Impacto',
          hint: 'Cuánto beneficio real ha generado, teniendo en cuenta a cuántas personas ha llegado y cuánto les ha ayudado.',
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
          default: 'Predeterminado',
          date: 'Fecha',
          span: 'Tiempo activo',
          name: 'Nombre',
          design: 'Diseño',
          engineering: 'Ingeniería',
          impact: 'Impacto',
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
