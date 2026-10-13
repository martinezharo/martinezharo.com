import { site } from '../../config/site';
import { getCopy, LOCALES, localizedPath, type Locale } from '../../i18n';
import type { Project, ProjectDetail } from '../projects/model';
import { formatProjectRange } from '../projects/model';
import { STACK } from '../stack/model';
import { SERVICES, formatPrice } from '../services/model';
import { quoteProjects } from '../services/quotes';
import { absoluteUrl, markdownPath, projectPath } from './urls';

function text(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/[\\`*_{}\[\]<>#]/g, '\\$&');
}

function link(label: string, url: string): string {
  return `[${text(label)}](<${url.replace(/>/g, '%3E').replace(/</g, '%3C')}>)`;
}

function source(origin: URL | undefined, locale: Locale, route: string): string {
  return `Source: ${absoluteUrl(localizedPath(locale, route), origin)}\nLanguage: ${locale}`;
}

export function llms(origin: URL | undefined, projects: readonly Project[]): string {
  const copy = getCopy('en');
  return [
    `# ${site.name}`,
    `> ${copy.site.description}`,
    'This is Oliver’s personal portfolio. Project pages describe his work, its story, and its technology stack. English lives at the root; Spanish lives under /es. The Markdown pages use the same public content as the HTML pages.',
    'Project ratings are Oliver’s own assessments, not customer reviews. “Active” describes project status, not uptime or current availability. Missing stories are not supplied or inferred.',
    '## Profile and stack',
    ...LOCALES.flatMap((locale) => [
      `- ${link(`Profile (${locale})`, absoluteUrl(markdownPath(locale, '/'), origin))}: Biography, contact, and current project list.`,
      `- ${link(`Stack (${locale})`, absoluteUrl(markdownPath(locale, '/stack'), origin))}: Tools and links to their official websites.`,
      `- ${link(`Services (${locale})`, absoluteUrl(markdownPath(locale, '/services'), origin))}: Services, indicative prices, and how to get in touch.`,
    ]),
    '## Projects',
    ...projects.flatMap((project) => LOCALES.map((locale) =>
      `- ${link(`${project.name} (${locale})`, absoluteUrl(markdownPath(locale, projectPath(project.slug)), origin))}`,
    )),
    '## Optional',
    `- ${link('GitHub', site.githubUrl)}: Public repositories.`,
    `- ${link('Sitemap', absoluteUrl('/sitemap.xml', origin))}: Canonical HTML pages in both languages.`,
  ].join('\n\n') + '\n';
}

export function profileMarkdown(origin: URL | undefined, locale: Locale, projects: readonly Project[]): string {
  const copy = getCopy(locale);
  return [
    `# ${site.name}`,
    `> ${copy.site.description}`,
    source(origin, locale, '/'),
    `## ${text(copy.about.heading)}`,
    copy.about.body,
    `Contact: ${site.email}\nServices: ${absoluteUrl(markdownPath(locale, '/services'), origin)}\nGitHub: ${site.githubUrl}`,
    `## ${text(copy.projects.heading)}`,
    ...projects.map((project) => [
      `- ${link(project.name, absoluteUrl(markdownPath(locale, projectPath(project.slug)), origin))}: ${text(project.blurb)}`,
      `  ${copy.projects.status[project.active ? 'active' : 'archived']} · ${formatProjectRange(project)}`,
    ].join('\n')),
    `## ${text(copy.navigation.stack)}`,
    link(copy.stack.title, absoluteUrl(markdownPath(locale, '/stack'), origin)),
  ].join('\n\n') + '\n';
}

export function stackMarkdown(origin: URL | undefined, locale: Locale): string {
  const copy = getCopy(locale);
  return [
    `# ${copy.stack.title}`,
    `> ${copy.stack.description}`,
    source(origin, locale, '/stack'),
    ...STACK.flatMap((category) => [
      `## ${text(copy.stack.categories[category.key])}`,
      ...category.tools.map((tool) => `- ${link(tool.name, tool.url)}`),
    ]),
  ].join('\n\n') + '\n';
}

export function servicesMarkdown(origin: URL | undefined, locale: Locale, projects: readonly Project[]): string {
  const copy = getCopy(locale);
  const words = copy.servicesPage;
  const quotes = quoteProjects(projects);
  return [
    `# ${text(words.title)}`,
    `> ${text(words.description)}`,
    source(origin, locale, '/services'),
    `## ${text(words.services.heading)}`,
    text(words.services.note),
    ...SERVICES.flatMap((service) => {
      const item = words.services.items[service.key];
      return [
        `### ${text(item.name)}`,
        text(item.pitch),
        service.tiers.map((tier) => {
          const meta = [words.services.delivery(tier.days)];
          if (tier.revisions !== null) meta.push(words.services.revisions(tier.revisions));
          return `- ${text(item.tiers[tier.key].name)}: ${formatPrice(tier.price, locale)} (${meta.join(', ')}). ${text(item.tiers[tier.key].description)}`;
        }).join('\n'),
        `${text(words.services.includesLabel)}:\n${item.includes.map((line) => `- ${text(line)}`).join('\n')}`,
        ...(item.excludes ? [text(item.excludes)] : []),
      ];
    }),
    ...(quotes.length ? [
      `## ${text(words.quotes.heading)}`,
      text(words.quotes.lede),
      quotes.map(({ project, price, duration }) =>
        `- ${link(project.name, absoluteUrl(markdownPath(locale, projectPath(project.slug)), origin))}: ${formatPrice(price, locale)} · ${words.quotes.duration[duration]}`,
      ).join('\n'),
    ] : []),
    `## ${text(words.contact.heading)}`,
    `${text(words.contact.lede)}\n\nEmail: ${site.email}\nFiverr: ${site.fiverrUrl}`,
  ].join('\n\n') + '\n';
}

export function projectMarkdown(origin: URL | undefined, locale: Locale, project: ProjectDetail): string {
  const copy = getCopy(locale);
  return [
    `# ${text(project.name)}`,
    `> ${text(project.blurb)}`,
    source(origin, locale, projectPath(project.slug)),
    `${copy.projects.status[project.active ? 'active' : 'archived']} · ${formatProjectRange(project)}`,
    ...(project.url ? [link(project.name, project.url)] : []),
    ...(project.repo ? [link('GitHub', project.repo)] : []),
    `## ${text(copy.common.builtWith)}`,
    project.stack.map(text).join(', '),
    `## ${text(copy.detail.storyHeading)}`,
    ...(project.history.length ? project.history : [copy.detail.storyNone]),
  ].join('\n\n') + '\n';
}
