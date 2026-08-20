import type { Project } from './model';
import { SORT_FIELDS } from './model';
import { getCopy, type Locale } from '../../i18n';

export interface FilterOption {
  label: string;
  attrs: Record<string, string>;
  hint?: string;
  rename?: 'desc' | 'asc';
}

export interface FilterField {
  key: string;
  label: string;
  echo: string;
  options: FilterOption[];
}

export const FILTER_CLAUSES = [
  { key: 'status', facet: 'status' },
  { key: 'kind', facet: 'kind' },
  { key: 'order', facet: 'sort' },
] as const;

export function createFilterFields(projects: readonly Project[], locale: Locale): FilterField[] {
  const projectCopy = getCopy(locale).projects;
  const copy = projectCopy.filters;
  const activeCount = projects.filter((project) => project.active).length;
  const kinds = [...new Set(projects.map((project) => project.kind))];

  return [
    {
      key: 'status',
      label: copy.fieldLabels.status,
      echo: 'status',
      options: [
        { label: copy.statusLabels.all, attrs: { 'data-set-status': 'all' }, hint: copy.projectCount(projects.length) },
        { label: copy.statusLabels.active, attrs: { 'data-set-status': 'active' }, hint: copy.projectCount(activeCount) },
        {
          label: copy.statusLabels.archived,
          attrs: { 'data-set-status': 'archived' },
          hint: copy.projectCount(projects.length - activeCount),
        },
      ],
    },
    {
      key: 'kind',
      label: copy.fieldLabels.kind,
      echo: 'kind',
      options: [
        { label: projectCopy.kindLabels.all, attrs: { 'data-set-kind': 'all' }, hint: copy.projectCount(projects.length) },
        ...kinds.map((kind) => ({
          label: projectCopy.kindLabels[kind],
          attrs: { 'data-set-kind': kind },
          hint: copy.projectCount(projects.filter((project) => project.kind === kind).length),
        })),
      ],
    },
    {
      key: 'sort',
      label: copy.fieldLabels.sort,
      echo: 'sort',
      options: SORT_FIELDS.map((sort) => ({
        label: copy.sortLabels[sort.key],
        attrs: { 'data-set-sort': sort.key },
      })),
    },
    {
      key: 'dir',
      label: copy.fieldLabels.dir,
      echo: 'dir',
      options: (['desc', 'asc'] as const).map((direction) => ({
        label: copy.directionLabels.date[direction],
        attrs: { 'data-set-dir': direction },
        rename: direction,
      })),
    },
  ];
}
