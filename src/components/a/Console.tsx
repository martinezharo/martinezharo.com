import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KIND_LABEL,
  SCORE_META,
  overall,
  projects,
  range,
  type ProjectKind,
} from '../../data/projects';
import { SORTS, STATUSES, arrange, type SortKey, type Status } from '../../data/sorting';

const KINDS = [...new Set(projects.map((p) => p.kind))] as ProjectKind[];

/** Barra segmentada tipo panel de instrumentos. */
function Led({ value, tone }: { value: number; tone: 'amber' | 'live' }) {
  const segments = 12;
  const lit = Math.round((value / 100) * segments);
  return (
    <span className="a-led" data-tone={tone} aria-hidden="true">
      {Array.from({ length: segments }, (_, i) => (
        <i key={i} className={i < lit ? 'lit' : ''} />
      ))}
    </span>
  );
}

function SortMenu({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const current = SORTS.find((s) => s.key === value)!;

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div className="a-sort" ref={box}>
      <button
        type="button"
        className="a-sort-btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="a-sort-key">Ordenar</span>
        <span className="a-sort-val">{current.label}</span>
        <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      {open && (
        <ul className="a-sort-list" role="listbox" aria-label="Criterio de orden">
          {SORTS.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                role="option"
                aria-selected={s.key === value}
                className={s.key === value ? 'is-on' : ''}
                onClick={() => {
                  onChange(s.key);
                  setOpen(false);
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Console() {
  const [sort, setSort] = useState<SortKey>('recent');
  const [status, setStatus] = useState<Status>('all');
  const [kinds, setKinds] = useState<ProjectKind[]>([]);

  const list = useMemo(() => arrange(projects, { sort, status, kinds }), [sort, status, kinds]);

  const toggleKind = (k: ProjectKind) =>
    setKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <>
      <div className="a-toolbar">
        <SortMenu value={sort} onChange={setSort} />

        <div className="a-seg" role="group" aria-label="Estado">
          <span className="a-seg-key">Estado</span>
          {STATUSES.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={status === s.key}
              className={status === s.key ? 'is-on' : ''}
              onClick={() => setStatus(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="a-seg a-seg--kinds" role="group" aria-label="Tipo">
          <span className="a-seg-key">Tipo</span>
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kinds.includes(k)}
              className={kinds.includes(k) ? 'is-on' : ''}
              onClick={() => toggleKind(k)}
            >
              {KIND_LABEL[k]}
            </button>
          ))}
          {kinds.length > 0 && (
            <button type="button" className="a-clear" onClick={() => setKinds([])}>
              Limpiar
            </button>
          )}
        </div>

        <p className="a-count" aria-live="polite">
          <b>{String(list.length).padStart(2, '0')}</b>
          <span>/{String(projects.length).padStart(2, '0')} unidades</span>
        </p>
      </div>

      <ul className="a-rack">
        {list.map((p) => (
          <li key={p.slug}>
            <a className="a-unit" href={`/projects/${p.slug}`}>
              <span className="a-unit-chip">
                <img src={p.logo} alt="" loading="lazy" />
              </span>

              <span className="a-unit-id">
                <span className="a-unit-top">
                  <b>{p.name}</b>
                  <em data-live={p.active}>{p.active ? 'En activo' : 'Archivado'}</em>
                </span>
                <span className="a-unit-meta">
                  {KIND_LABEL[p.kind]} · {range(p)} · {p.stack.slice(0, 3).join(' / ')}
                </span>
                <span className="a-unit-blurb">{p.blurb}</span>
              </span>

              <span className="a-unit-readout">
                {SCORE_META.map((m) => (
                  <span className="a-metric" key={m.key} title={m.hint}>
                    <span className="a-metric-key">{m.label}</span>
                    <Led value={p.scores[m.key]} tone={m.key === 'impact' ? 'live' : 'amber'} />
                    <span className="a-metric-val">{p.scores[m.key]}</span>
                  </span>
                ))}
              </span>

              <span className="a-unit-total">
                <span className="a-total-num">{overall(p)}</span>
                <span className="a-total-key">Global</span>
                <span className="a-total-hours">{p.hours.toLocaleString('es-ES')} h</span>
              </span>

              <svg className="a-unit-go" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9M8 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="a-empty">Ningún proyecto encaja con ese filtro. Quita alguna condición.</p>
      )}
    </>
  );
}
