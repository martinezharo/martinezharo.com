import type { SortDirection, SortField } from '../features/projects/model';
import type { LocaleCopy } from './types';

const germanDirections: Record<SortField, Record<SortDirection, string>> = {
  default: { desc: 'Meiste Metriken zuerst', asc: 'Wenigste Metriken zuerst' },
  date: { desc: 'Neueste zuerst', asc: 'Älteste zuerst' },
  span: { desc: 'Am längsten aktiv zuerst', asc: 'Am kürzesten aktiv zuerst' },
  name: { desc: 'Z bis A', asc: 'A bis Z' },
  design: { desc: 'Höchste Wertung zuerst', asc: 'Niedrigste Wertung zuerst' },
  engineering: { desc: 'Höchste Wertung zuerst', asc: 'Niedrigste Wertung zuerst' },
  impact: { desc: 'Höchste Wertung zuerst', asc: 'Niedrigste Wertung zuerst' },
  maturity: { desc: 'Höchste Wertung zuerst', asc: 'Niedrigste Wertung zuerst' },
};

// Informal "du" throughout, like the English and Spanish voices.
export const de: LocaleCopy = {
  site: {
    title: 'Oliver Martínez Haro — Softwareentwickler',
    description:
      'Oliver Martínez Haro ist ein Softwareentwickler aus Spanien, der seine eigenen Tools baut, die meisten davon als Open Source veröffentlicht und am Laufen hält.',
    intro: {
      eyebrow: 'Entwickler · Spanien',
      // Short on purpose: the rail is narrow, and "Ich brauche es," is two
      // words too long for it. This keeps the same turn as the other languages.
      heading: 'Brauch ich,\nbau ich.',
      body: 'Am meisten Freude machen mir Interfaces: sauber anzusehen und angenehm zu benutzen. Und darunter frage ich mich ständig, wie die App schneller, sicherer und barrierefreier werden kann.',
    },
    availability: 'Offen für spannende Projekte',
    servicesCta: 'Leistungen und Preise →',
  },
  navigation: {
    home: 'Start',
    primary: 'Hauptnavigation',
    language: 'Sprache',
    stack: 'Stack',
    services: 'Leistungen',
    github: 'GitHub ↗',
    githubBadge: 'GitHub-Profil (öffnet in einem neuen Tab)',
    pageScroll: 'Seite scrollen',
  },
  languageSuggestion: {
    label: 'Auch auf Deutsch verfügbar',
    hint: 'Diese Seite gibt es auch auf Deutsch',
    action: 'Zu Deutsch wechseln',
    dismiss: 'Sprachvorschlag schließen',
  },
  common: {
    skipProjects: 'Zu den Projekten springen',
    skipStory: 'Zur Geschichte springen',
    skipStack: 'Zum Stack springen',
    skipServices: 'Zu den Leistungen springen',
    close: 'Schließen',
    builtWith: 'Gebaut mit',
    officialWebsite: (name) => `Offizielle Website von ${name} besuchen (öffnet in einem neuen Tab)`,
    conditionIs: 'ist',
    removeCondition: (label) => `Bedingung „${label}“ entfernen`,
  },
  about: {
    eyebrow: 'Ein wenig Kontext',
    heading: 'Hallo! Hier ist Oli ☝🏻👹',
    body:
      'Ich bin 22 Jahre alt und springe seit meinem 16. Lebensjahr von einem Projekt zum nächsten – immer auf der Suche nach etwas, das es wert ist, gebaut zu werden.\n\nAngefangen habe ich mit Inhalten für Social Media, bin dann in den E-Commerce gewechselt und habe mich schließlich in das Programmieren verliebt, als KI zu einem wirklich nützlichen Werkzeug für die Softwareentwicklung wurde.\n\nNachdem ich es geschafft hatte, ein paar Projekte zu starten, ohne auch nur zu wissen, was ein simples `console.log` ist, beschloss ich, dass es endlich an der Zeit war, programmieren zu lernen. Es war eine der besten Entscheidungen, die ich je getroffen habe.\n\nSeitdem ist meine Produktivität durch die Decke gegangen, und ich habe angefangen, all die Tools, Websites und Ideen, die ich mir einmal gewünscht hatte, in eigene Projekte zu verwandeln.',
  },
  stack: {
    title: 'Der Stack — Oliver Martínez Haro',
    description:
      'Die Sprachen, Frameworks und Tools, die Oliver Martínez Haro standardmäßig einsetzt, Kategorie für Kategorie.',
    intro: {
      eyebrow: 'Der Stack',
      heading: 'Womit ich\nbaue.',
    },
    heading: 'Favoriten nach Kategorie',
    count: (categories, tools) => `${categories} Kategorien · ${tools} Tools`,
    categories: {
      languages: 'Sprachen',
      frameworks: 'Frameworks',
      uiLibraries: 'UI-Bibliotheken',
      cssFramework: 'CSS-Framework',
      backendPlatform: 'Backend-Plattform',
      deploymentPlatform: 'Deployment-Plattform',
      packageManager: 'Paketmanager',
      buildTool: 'Build-Tool',
      testing: 'Testing',
      ciCd: 'CI/CD',
      versionControl: 'Versionsverwaltung',
      codeHosting: 'Code-Hosting',
      codeEditor: 'Code-Editor',
      devEnvironment: 'Entwicklungsumgebung',
      shell: 'Shell',
      aiAgents: 'KI-Coding-Agenten',
    },
  },
  footer: {
    prompt: 'Du hast ein Projekt im Kopf?',
    cta: 'Lass uns reden',
  },
  servicesPage: {
    title: 'Leistungen — Oliver Martínez Haro',
    description:
      'Web-Apps, Landingpages und Interface-Redesigns von Oliver Martínez Haro: was jede Leistung umfasst, Richtpreise und ein Formular, um ihm von deinem Projekt zu erzählen.',
    intro: {
      eyebrow: 'Arbeite mit mir',
      heading: 'Brauchst du,\nbau ich.',
      body: 'Web-Apps, Landingpages und Redesigns – gebaut nach dem, was du wirklich brauchst, und veröffentlicht auf deiner eigenen Domain.',
    },
    services: {
      heading: 'Was ich für dich bauen kann',
      note: 'Richtpreise. Jedes Projekt ist anders: Vor dem Start bekommst du ein verbindliches Festpreisangebot.',
      fiverr: 'Auch auf Fiverr ↗',
      from: 'ab',
      ask: 'Angebot anfragen',
      includesLabel: 'Immer enthalten',
      delivery: (days) => `${days} Tage`,
      revisions: (count) => `${count} ${count === 1 ? 'Überarbeitung' : 'Überarbeitungen'}`,
      items: {
        webApp: {
          name: 'Web-App',
          pitch: 'Deine Idee als Live-App, mit Domain und Hosting.',
          includes: [
            'Nach deinen Anforderungen gebaut, nicht aus einer Vorlage',
            'Funktioniert auf Desktop, Tablet und Smartphone',
            'Kostenloses Hosting im dauerhaft kostenlosen Tarif von Cloudflare',
            'Deine Domain verbunden (oder eine neue registriert, +15 US-$)',
            'Der komplette Quellcode in einem GitHub-Repository unter deinem Konto',
          ],
          excludes: 'Domain-Verlängerungen, kostenpflichtige Drittanbieter-Dienste und laufende Wartung sind nicht enthalten.',
          tiers: {
            basic: {
              name: 'Mini',
              description: 'Eine einfache Web-App mit einer Kernfunktion und bis zu 2 Seiten.',
            },
            standard: {
              name: 'Business',
              description: 'Bis zu 3 Kernfunktionen und 4 Seiten, mit Datenbank und Inhalts-Upload.',
            },
            premium: {
              name: 'Erweitert',
              description: 'Bis zu 5 Kernfunktionen und 6 Seiten, mit Datenbank und Integrationen.',
            },
          },
        },
        landing: {
          name: 'Landingpage',
          pitch: 'Eine Seite, die Besucher zu Kunden macht.',
          includes: [
            'Ein eigenes Design, kein Theme',
            'Schnell, barrierefrei und responsiv',
            'Kostenloses Hosting im dauerhaft kostenlosen Tarif von Cloudflare',
            'Deine Domain verbunden',
            'Der komplette Quellcode in einem GitHub-Repository unter deinem Konto',
          ],
          tiers: {
            basic: {
              name: 'Essenziell',
              description: 'Eine Seite mit bis zu 5 Abschnitten, bereit zum Teilen.',
            },
            standard: {
              name: 'Launch',
              description: 'Bis zu 8 Abschnitte, individuelle Animationen, ein Kontaktformular und grundlegendes SEO.',
            },
            premium: {
              name: 'Signature',
              description: 'Bis zu 12 Abschnitte in zwei Sprachen, mit Analytics und Performance-Optimierung.',
            },
          },
        },
        redesign: {
          name: 'Redesign',
          pitch: 'Deine Website, klarer, stimmiger und angenehmer zu bedienen, umgesetzt in deinem eigenen Code.',
          includes: [
            'Hierarchie, Abstände, Typografie und Konsistenz',
            'Usability und Responsivität',
            'HTML/CSS, TypeScript, React, Tailwind, Astro, Next.js und ähnliche Stacks',
          ],
          excludes: 'Backend-Systeme, Zahlungen und API-Integrationen sind nicht enthalten, sofern nicht separat vereinbart.',
          tiers: {
            basic: {
              name: 'Auffrischung',
              description: 'Ein kleiner Teil der Oberfläche: ein Abschnitt, eine Komponente, ein Formular oder die Navigation.',
            },
            standard: {
              name: 'Redesign',
              description: 'Ein größerer Teil der Oberfläche, mit mehr Konsistenz, Usability und Responsivität.',
            },
            premium: {
              name: 'Generalüberholung',
              description: 'Eine komplexe Oberfläche, von Anfang bis Ende stimmig gemacht und mit einem flüssigeren Erlebnis.',
            },
          },
        },
      },
    },
    quotes: {
      heading: 'Was meine Projekte kosten würden',
      lede: 'Wenn ein Kunde sie heute in Auftrag geben würde.',
      count: (projects) => `${projects} ${projects === 1 ? 'Projekt' : 'Projekte'}`,
      thisSite: 'Diese Website',
      duration: { weeks: '1–4 Wochen', months: '1–3 Monate' },
      priceLabel: (name, price) => `${name}: etwa ${price}`,
    },
    contact: {
      heading: 'Erzähl mir von deinem Projekt',
      lede: 'Ein paar Zeilen reichen. Ich antworte mit Rückfragen oder einem Angebot.',
      name: 'Name',
      email: 'E-Mail',
      service: 'Was brauchst du?',
      services: {
        webApp: 'Web-App',
        landing: 'Landingpage',
        redesign: 'Redesign',
        other: 'Etwas anderes',
      },
      message: 'Dein Projekt',
      messagePlaceholder: 'Was es ist, für wen es ist und bis wann du es gerne fertig hättest.',
      submit: 'Senden',
      sending: 'Wird gesendet…',
      sent: 'Danke! Deine Nachricht ist unterwegs. Ich melde mich bald bei dir.',
      errors: {
        invalid: 'Prüfe die Felder: ein Name, eine gültige E-Mail-Adresse und ein paar Worte zum Projekt.',
        challenge: 'Die Spam-Prüfung ist fehlgeschlagen. Warte einen Moment und versuche es erneut.',
        unavailable: 'Die Nachricht konnte gerade nicht gesendet werden. Schreib mir bitte direkt.',
      },
      direct: 'Lieber per E-Mail?',
      noscript: 'Das Formular braucht JavaScript. Du kannst mir stattdessen direkt schreiben.',
    },
  },
  errors: {
    notFound: 'Nicht gefunden',
    projectNotFound: 'Projekt nicht gefunden',
  },
  projects: {
    heading: 'Was ich gebaut habe',
    status: { active: 'Aktiv', archived: 'Archiviert' },
    kindLabels: {
      all: 'Alle Typen',
      ecommerce: 'E-Commerce',
      marketplace: 'Marktplatz',
      app: 'App',
      game: 'Spiel',
      brand: 'Marke',
    },
    metrics: {
      design: {
        label: 'Design',
        hint: 'Wie stark Oberfläche und Nutzungserlebnis sind.',
      },
      engineering: {
        // "Technik" rather than "Engineering": it keeps the label within a few
        // letters of the other three, which is what lets them share one row of
        // the card.
        label: 'Technik',
        hint: 'Wie technisch anspruchsvoll oder ausgefeilt das Projekt ist.',
      },
      impact: {
        label: 'Wirkung',
        hint: 'Wie viel echten Nutzen es gebracht hat, gemessen daran, wie viele Menschen es erreicht hat und wie sehr es ihnen geholfen hat.',
      },
      maturity: {
        label: 'Reife',
        hint: 'Wie vollständig, zuverlässig, ausgereift und bereit für die echte Welt es ist.',
      },
    },
    meter: {
      notApplicable: (label) => `${label}: trifft nicht zu`,
      rating: (label, rating) => `${label}: ${rating} von 5`,
    },
    filters: {
      buttonLabel: 'Filtern und sortieren',
      buttonTitle: 'Filtern und sortieren',
      fieldsLabel: 'Felder',
      empty: 'Kein Projekt passt zu diesen Filtern.',
      fieldLabels: { status: 'Status', kind: 'Typ', sort: 'Reihenfolge', dir: 'Richtung' },
      clauseLabels: { status: 'Status', kind: 'Typ', order: 'Reihenfolge' },
      statusLabels: {
        all: 'Alle Status',
        active: 'Aktiv',
        archived: 'Archiviert',
      },
      sortLabels: {
        default: 'Standard',
        date: 'Datum',
        span: 'Aktivitätsdauer',
        name: 'Name',
        design: 'Design',
        engineering: 'Technik',
        impact: 'Wirkung',
        maturity: 'Reife',
      },
      directionLabels: germanDirections,
      projectCount: (count) => `${count} ${count === 1 ? 'Projekt' : 'Projekte'}`,
      announcements: {
        all: (total) => `Alle ${total} Projekte werden angezeigt`,
        some: (count, total) => `${count} von ${total} Projekten werden angezeigt`,
        filter: (label, value) => `${label}: ${value}`,
        order: (value) => `sortiert nach ${value}`,
      },
    },
    legend: {
      button: 'So funktionieren die Bewertungen',
      title: 'So funktionieren die Bewertungen',
      close: 'Schließen',
      lede: 'Ein Projekt hat bis zu vier Bewertungen, jeweils als fünf Segmente dargestellt. Der beleuchtete Teil ist die Wertung, der Rest der Skala bleibt sichtbar, sodass sich zwei Projekte vergleichen lassen, ohne eine Zahl zu lesen.',
    },
  },
  detail: {
    back: 'Alle Projekte',
    linksLabel: (name) => `Links zu ${name}`,
    visitSite: 'Website besuchen',
    viewSource: 'Quellcode ansehen',
    storyHeading: 'Wie es lief',
    storyNone: 'Dazu wurde noch nichts geschrieben.',
    nextLabel: 'Nächstes Projekt',
    nextEyebrow: 'Als Nächstes',
  },
};
