import type { Project } from './model';
import { DIRECTION_LABEL, KIND_LABEL, SORT_FIELDS } from './model';

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
  { key: 'status', label: 'Status', facet: 'status' },
  { key: 'kind', label: 'Type', facet: 'kind' },
  { key: 'order', label: 'Order', facet: 'sort' },
] as const;

const projectCount = (count: number) => `${count} project${count === 1 ? '' : 's'}`;

export function createFilterFields(projects: readonly Project[]): FilterField[] {
  const activeCount = projects.filter((project) => project.active).length;
  const kinds = [...new Set(projects.map((project) => project.kind))];

  return [
    {
      key: 'status',
      label: 'Status',
      echo: 'status',
      options: [
        { label: 'Every status', attrs: { 'data-set-status': 'all' }, hint: projectCount(projects.length) },
        { label: 'Active', attrs: { 'data-set-status': 'active' }, hint: projectCount(activeCount) },
        {
          label: 'Archived',
          attrs: { 'data-set-status': 'archived' },
          hint: projectCount(projects.length - activeCount),
        },
      ],
    },
    {
      key: 'kind',
      label: 'Type',
      echo: 'kind',
      options: [
        { label: 'Every type', attrs: { 'data-set-kind': 'all' }, hint: projectCount(projects.length) },
        ...kinds.map((kind) => ({
          label: KIND_LABEL[kind],
          attrs: { 'data-set-kind': kind },
          hint: projectCount(projects.filter((project) => project.kind === kind).length),
        })),
      ],
    },
    {
      key: 'sort',
      label: 'Order',
      echo: 'sort',
      options: SORT_FIELDS.map((sort) => ({
        label: sort.label,
        attrs: { 'data-set-sort': sort.key },
      })),
    },
    {
      key: 'dir',
      label: 'Direction',
      echo: 'dir',
      options: (['desc', 'asc'] as const).map((direction) => ({
        label: DIRECTION_LABEL.date[direction],
        attrs: { 'data-set-dir': direction },
        rename: direction,
      })),
    },
  ];
}
