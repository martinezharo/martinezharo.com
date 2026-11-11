import type {
  ProjectKind,
  ProjectStatus,
  ScoreKey,
  SortDirection,
  SortField,
} from '../features/projects/model';
import type { CategoryKey } from '../features/stack/model';
import type { ContactError, ContactService } from '../features/services/contact';
import type { QuoteDuration, ServiceKey, TierKey } from '../features/services/model';

export interface MetricCopy {
  label: string;
  hint: string;
}

export interface ServiceCopy {
  name: string;
  /** One line under the name: what the service gets you. */
  pitch: string;
  includes: string[];
  /** What a package leaves out, said once under the packages. */
  excludes?: string;
  tiers: Record<TierKey, { name: string; description: string }>;
}

export interface ServicesPageCopy {
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
    /** Before the lowest price on each poster. */
    from: string;
    ask: string;
    includesLabel: string;
    delivery(days: number): string;
    revisions(count: number): string;
    items: Record<ServiceKey, ServiceCopy>;
  };
  quotes: {
    heading: string;
    lede: string;
    count(projects: number): string;
    thisSite: string;
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
    /** The rail's way to the services page, under the availability line. */
    servicesCta: string;
  };
  navigation: {
    home: string;
    primary: string;
    language: string;
    stack: string;
    services: string;
    github: string;
    /** The badge shows the mark alone, so its name has to be spoken here. */
    githubBadge: string;
    /** The page's own scrollbar is drawn by the site, so it has to be named. */
    pageScroll: string;
  };
  /**
   * The pill that offers a reader the language their browser asks for. It is
   * written in the language on offer, not the one of the page it appears on:
   * that is the one the reader is expected to read.
   */
  languageSuggestion: {
    label: string;
    hint: string;
    action: string;
    dismiss: string;
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
  servicesPage: ServicesPageCopy;
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
      fieldsLabel: string;
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
