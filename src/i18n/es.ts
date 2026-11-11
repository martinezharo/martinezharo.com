import type { SortDirection, SortField } from '../features/projects/model';
import type { LocaleCopy } from './types';

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

export const es: LocaleCopy = {
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
    servicesCta: 'Servicios y precios →',
  },
  navigation: {
    home: 'Inicio',
    primary: 'Navegación principal',
    language: 'Idioma',
    stack: 'Stack',
    services: 'Servicios',
    github: 'GitHub ↗',
    githubBadge: 'Perfil de GitHub (se abre en una pestaña nueva)',
    pageScroll: 'Desplazamiento de página',
  },
  languageSuggestion: {
    label: 'También disponible en español',
    hint: 'Esta página también está en español',
    action: 'Cambiar a español',
    dismiss: 'Cerrar sugerencia de idioma',
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
  servicesPage: {
    title: 'Servicios — Oliver Martínez Haro',
    description:
      'Aplicaciones web, landing pages y rediseños de interfaz de Oliver Martínez Haro: qué incluye cada servicio, precios orientativos y un formulario para contarle tu proyecto.',
    intro: {
      eyebrow: 'Trabaja conmigo',
      heading: 'Lo necesitas,\nlo hago.',
      body: 'Aplicaciones web, landing pages y rediseños, hechos a partir de lo que de verdad necesitas y publicados en tu propio dominio.',
    },
    services: {
      heading: 'Lo que puedo hacer por ti',
      note: 'Precios orientativos. Cada proyecto es único: te doy un precio cerrado antes de empezar.',
      fiverr: 'También en Fiverr ↗',
      from: 'desde',
      ask: 'Pedir presupuesto',
      includesLabel: 'Siempre incluido',
      delivery: (days) => `${days} días`,
      revisions: (count) => `${count} ${count === 1 ? 'revisión' : 'revisiones'}`,
      items: {
        webApp: {
          name: 'Aplicación web',
          pitch: 'Tu idea convertida en una app online, con dominio y hosting.',
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
          pitch: 'Una página que convierte visitas en clientes.',
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
          pitch: 'Tu web, más clara, coherente y agradable de usar, mejorada en tu propio código.',
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
      heading: 'Lo que costarían mis proyectos',
      lede: 'Si hoy me los encargara un cliente.',
      count: (projects) => `${projects} proyecto${projects === 1 ? '' : 's'}`,
      thisSite: 'Esta web',
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
      fieldsLabel: 'Campos',
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
};
