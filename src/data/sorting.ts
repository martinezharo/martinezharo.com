import { overall, type Project, type ProjectKind } from './projects';

export type SortKey =
  | 'recent'
  | 'oldest'
  | 'alpha'
  | 'overall'
  | 'craft'
  | 'depth'
  | 'utility'
  | 'impact'
  | 'hours';

export type Status = 'all' | 'active' | 'archived';

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Más reciente' },
  { key: 'oldest', label: 'Más antiguo' },
  { key: 'alpha', label: 'Alfabético' },
  { key: 'overall', label: 'Puntuación global' },
  { key: 'craft', label: 'Craft' },
  { key: 'depth', label: 'Depth' },
  { key: 'utility', label: 'Utility' },
  { key: 'impact', label: 'Impact' },
  { key: 'hours', label: 'Horas invertidas' },
];

export const STATUSES: { key: Status; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'En activo' },
  { key: 'archived', label: 'Archivados' },
];

export function arrange(
  list: Project[],
  { sort, status, kinds }: { sort: SortKey; status: Status; kinds: ProjectKind[] },
): Project[] {
  const filtered = list.filter((p) => {
    if (status === 'active' && !p.active) return false;
    if (status === 'archived' && p.active) return false;
    if (kinds.length && !kinds.includes(p.kind)) return false;
    return true;
  });

  const by = [...filtered];
  switch (sort) {
    case 'recent':
      return by.sort((a, b) => b.start - a.start || a.name.localeCompare(b.name, 'es'));
    case 'oldest':
      return by.sort((a, b) => a.start - b.start || a.name.localeCompare(b.name, 'es'));
    case 'alpha':
      return by.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    case 'hours':
      return by.sort((a, b) => b.hours - a.hours);
    case 'overall':
      return by.sort((a, b) => overall(b) - overall(a));
    default:
      return by.sort((a, b) => b.scores[sort] - a.scores[sort]);
  }
}
