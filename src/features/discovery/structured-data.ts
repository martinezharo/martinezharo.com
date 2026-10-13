import { site } from '../../config/site';
import type { ProjectDetail } from '../projects/model';
import { getCopy, type Locale } from '../../i18n';
import { absoluteUrl } from './urls';

export function pageStructuredData(
  origin: URL | undefined,
  canonical: string,
  locale: Locale,
  title: string,
  description: string,
  project?: ProjectDetail,
) {
  const root = absoluteUrl('/', origin);
  const personId = `${root}#person`;
  const websiteId = `${root}#website`;
  const pageId = `${canonical}#webpage`;
  const workId = `${canonical}#project`;
  const isProfile = canonical === absoluteUrl(locale === 'en' ? '/' : '/es', origin);
  const pageType = project ? 'WebPage' : isProfile ? 'ProfilePage' : 'CollectionPage';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: site.name,
        url: root,
        description: getCopy(locale).site.description,
        email: site.email,
        sameAs: [site.githubUrl],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: root,
        name: site.name,
        inLanguage: ['en', 'es'],
        publisher: { '@id': personId },
      },
      {
        '@type': pageType,
        '@id': pageId,
        url: canonical,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        ...(project
          ? { mainEntity: { '@id': workId } }
          : isProfile ? { mainEntity: { '@id': personId } } : {}),
      },
      ...(project
        ? [{
            '@type': 'CreativeWork',
            '@id': workId,
            name: project.name,
            description: project.blurb,
            url: canonical,
            inLanguage: locale,
            creator: { '@id': personId },
            mainEntityOfPage: { '@id': pageId },
            ...(project.stack.length ? { keywords: project.stack } : {}),
            ...(project.url ? { sameAs: [project.url] } : {}),
          }]
        : []),
    ],
  };
}

// JSON strings may contain HTML supplied by a project description. Escaping
// `<` keeps a literal closing script tag inside the JSON, not in the document.
export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
