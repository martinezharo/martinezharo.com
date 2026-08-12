import { useMemo, useState, type ReactNode } from 'react';
import { KIND_LABEL, SCORE_META, projects, range, type Project } from '../../data/projects';

type Filter = 'all' | 'active';
export type WorkVariant = 'base' | 'c1' | 'c2' | 'c3';

const ratingFor = (value: number) => Math.max(1, Math.min(5, Math.round(value / 20)));

function Stars({ value, emphasis = false }: { value: number; emphasis?: boolean }) {
  const rating = ratingFor(value);
  return (
    <span className={`c-stars ${emphasis ? 'c-stars--large' : ''}`} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <i key={index} data-on={index < rating} aria-hidden="true">★</i>
      ))}
    </span>
  );
}

function ProjectShell({
  project,
  className,
  children,
}: {
  project: Project;
  className: string;
  children: ReactNode;
}) {
  return project.url ? (
    <a className={className} href={project.url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <article className={`${className} is-static`}>{children}</article>
  );
}

function State({ project }: { project: Project }) {
  return (
    <span className="c-card-state" data-active={project.active}>
      <i aria-hidden="true" /> {project.active ? 'Active' : 'Archived'}
    </span>
  );
}

function Metric({ project, metric }: { project: Project; metric: (typeof SCORE_META)[number] }) {
  const value = project.scores[metric.key];
  return (
    <span className="c-metric" data-metric={metric.key} title={metric.hint}>
      <span className="c-metric-head">
        <b>{metric.label}</b>
      </span>
      <Stars value={value} />
    </span>
  );
}

function BaseCard({ project, index }: { project: Project; index: number }) {
  return (
    <ProjectShell project={project} className="c-card">
      <span className="c-card-top">
        <span className="c-card-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="c-card-logo"><img src={project.logo} alt="" loading="lazy" /></span>
      </span>
      <span className="c-card-title">
        <span>{project.name}</span>
        {project.url && <span className="c-card-arrow" aria-hidden="true">↗</span>}
      </span>
      <span className="c-card-blurb">{project.blurb}</span>
      <span className="c-card-foot">
        <span>{KIND_LABEL[project.kind]}</span>
        <span>{range(project)}</span>
        <State project={project} />
      </span>
    </ProjectShell>
  );
}

function ProfileCard({ project, index }: { project: Project; index: number }) {
  return (
    <ProjectShell project={project} className="c-card c1-card">
      <span className="c-card-top">
        <span className="c-card-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="c-card-logo"><img src={project.logo} alt="" loading="lazy" /></span>
      </span>
      <span className="c-card-title">
        <span>{project.name}</span>
        {project.url && <span className="c-card-arrow" aria-hidden="true">↗</span>}
      </span>
      <span className="c-card-blurb">{project.blurb}</span>
      <span className="c-profile" aria-label={`${project.name} project profile`}>
        {SCORE_META.map((metric) => <Metric key={metric.key} project={project} metric={metric} />)}
      </span>
      <span className="c-card-foot">
        <span>{KIND_LABEL[project.kind]}</span>
        <span>{range(project)}</span>
        <State project={project} />
      </span>
    </ProjectShell>
  );
}

function ImpactRow({ project, index }: { project: Project; index: number }) {
  return (
    <ProjectShell project={project} className="c2-row">
      <span className="c2-ident">
        <span className="c-card-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="c-card-logo"><img src={project.logo} alt="" loading="lazy" /></span>
      </span>
      <span className="c2-copy">
        <span className="c2-name">
          {project.name}
          {project.url && <span aria-hidden="true">↗</span>}
        </span>
        <span className="c-card-blurb">{project.blurb}</span>
        <span className="c2-meta">
          {KIND_LABEL[project.kind]} · {range(project)} <State project={project} />
        </span>
      </span>
      <span className="c2-scores">
        <span className="c2-impact" title={SCORE_META[3].hint}>
          <span><Stars value={project.scores.impact} emphasis /><em>Impact</em></span>
        </span>
        <span className="c2-secondary">
          {SCORE_META.slice(0, 3).map((metric) => <Metric key={metric.key} project={project} metric={metric} />)}
        </span>
      </span>
    </ProjectShell>
  );
}

function MatrixRow({ project, index }: { project: Project; index: number }) {
  return (
    <ProjectShell project={project} className="c3-row">
      <span className="c3-project">
        <span className="c-card-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="c-card-logo"><img src={project.logo} alt="" loading="lazy" /></span>
        <span>
          <b>{project.name}{project.url && <i aria-hidden="true">↗</i>}</b>
          <em>{KIND_LABEL[project.kind]} · {range(project)} · {project.active ? 'Active' : 'Archived'}</em>
          <small>{project.blurb}</small>
        </span>
      </span>
      <span className="c3-metrics">
        {SCORE_META.map((metric) => <Metric key={metric.key} project={project} metric={metric} />)}
      </span>
    </ProjectShell>
  );
}

function FilterBar({
  filter,
  setFilter,
  count,
  ordered,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  count: number;
  ordered: boolean;
}) {
  return (
    <div className="c-filterbar">
      <div className="c-segmented" role="group" aria-label="Filter projects">
        {([['all', 'All projects'], ['active', 'Active now']] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p aria-live="polite">
        {ordered && 'Ordered by impact rating · '}Showing {count} of {projects.length}
      </p>
    </div>
  );
}

export default function Work({ variant = 'base' }: { variant?: WorkVariant }) {
  const [filter, setFilter] = useState<Filter>('all');
  const ordered = variant === 'c2' || variant === 'c3';
  const list = useMemo(() => {
    const filtered = filter === 'active' ? projects.filter((project) => project.active) : projects;
    return ordered
      ? [...filtered].sort((a, b) => ratingFor(b.scores.impact) - ratingFor(a.scores.impact))
      : filtered;
  }, [filter, ordered]);

  return (
    <>
      <FilterBar filter={filter} setFilter={setFilter} count={list.length} ordered={ordered} />

      {variant === 'c2' ? (
        <div className="c2-list">
          {list.map((project, index) => <ImpactRow key={project.slug} project={project} index={index} />)}
        </div>
      ) : variant === 'c3' ? (
        <div className="c3-matrix">
          <div className="c3-head" aria-hidden="true">
            <span>Project</span>
            <span>Craft</span><span>Depth</span><span>Utility</span><span>Impact</span>
          </div>
          {list.map((project, index) => <MatrixRow key={project.slug} project={project} index={index} />)}
        </div>
      ) : (
        <div className="c-grid">
          {list.map((project, index) =>
            variant === 'c1'
              ? <ProfileCard key={project.slug} project={project} index={index} />
              : <BaseCard key={project.slug} project={project} index={index} />,
          )}
        </div>
      )}
    </>
  );
}
