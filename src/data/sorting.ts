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
  { key: 'recent', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'alpha', label: 'A–Z' },
  { key: 'overall', label: 'Overall' },
  { key: 'craft', label: 'Craft' },
  { key: 'depth', label: 'Depth' },
  { key: 'utility', label: 'Utility' },
  { key: 'impact', label: 'Impact' },
  { key: 'hours', label: 'Time spent' },
];

export const STATUSES: { key: Status; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'archived', label: 'Archive' },
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
