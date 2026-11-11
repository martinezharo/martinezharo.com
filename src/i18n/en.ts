import type { SortDirection, SortField } from '../features/projects/model';
import type { LocaleCopy } from './types';

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

export const en: LocaleCopy = {
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
    servicesCta: 'Services and prices →',
  },
  navigation: {
    home: 'Home',
    primary: 'Primary navigation',
    language: 'Language',
    stack: 'Stack',
    services: 'Services',
    github: 'GitHub ↗',
    githubBadge: 'GitHub profile (opens in a new tab)',
    pageScroll: 'Page scroll',
  },
  languageSuggestion: {
    label: 'Also available in English',
    hint: 'This page is also in English',
    action: 'Switch to English',
    dismiss: 'Dismiss language suggestion',
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
  servicesPage: {
    title: 'Services — Oliver Martínez Haro',
    description:
      'Web apps, landing pages and interface redesigns by Oliver Martínez Haro: what each service includes, indicative prices, and a form to tell him about your project.',
    intro: {
      eyebrow: 'Work with me',
      heading: 'You need it,\nI build it.',
      body: 'Web apps, landing pages and redesigns, built around what you actually need and launched on your own domain.',
    },
    services: {
      heading: 'What I can build for you',
      note: 'Indicative prices. Every project is different: you get a fixed quote before I start.',
      fiverr: 'Also on Fiverr ↗',
      from: 'from',
      ask: 'Get a quote',
      includesLabel: 'Always included',
      delivery: (days) => `${days} days`,
      revisions: (count) => `${count} revision${count === 1 ? '' : 's'}`,
      items: {
        webApp: {
          name: 'Web app',
          pitch: 'Your idea as a live app, with domain and hosting.',
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
          pitch: 'One page that turns visits into clients.',
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
          pitch: 'Your site, clearer, consistent and nicer to use, fixed in your own code.',
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
      lede: 'If a client ordered them today.',
      count: (projects) => `${projects} project${projects === 1 ? '' : 's'}`,
      thisSite: 'This site',
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
      fieldsLabel: 'Fields',
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
};
