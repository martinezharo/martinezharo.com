import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  KIND_LABEL,
  SCORE_META,
  overall,
  projects,
  range,
  type Project,
  type ProjectKind,
} from '../../data/projects';
import { SORTS, STATUSES, arrange, type SortKey, type Status } from '../../data/sorting';

const KINDS = [...new Set(projects.map((p) => p.kind))] as ProjectKind[];

const reduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Las tarjetas se recolocan con View Transitions, así el reordenado se sigue
 * con la vista en vez de aparecer de golpe. Sin soporte, cambia y ya está.
 */
function animate(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (!doc.startViewTransition || reduced()) return update();
  doc.startViewTransition(() => flushSync(update));
}

/** Control segmentado con pastilla deslizante medida sobre el DOM real. */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (k: T) => void;
  label: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });

  useLayoutEffect(() => {
    const place = () => {
      const host = wrap.current;
      const active = host?.querySelector<HTMLButtonElement>('[data-on="true"]');
      if (!host || !active) return;
      setPill({
        x: active.offsetLeft,
        w: active.offsetWidth,
        ready: true,
      });
    };
    place();
    const ro = new ResizeObserver(place);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [value, options]);

  return (
    <div className="c-seg" role="group" aria-label={label} ref={wrap}>
      <span
        className="c-seg-pill"
        aria-hidden="true"
        style={{
          transform: `translateX(${pill.x}px)`,
          width: `${pill.w}px`,
          opacity: pill.ready ? 1 : 0,
        }}
      />
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          data-on={o.key === value}
          aria-pressed={o.key === value}
          onClick={() => animate(() => onChange(o.key))}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SortPop({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const current = SORTS.find((s) => s.key === value)!;

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !host.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div className="c-sort" ref={host}>
      <button
        type="button"
        className="c-sort-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path
            d="M2.5 4.5h11M4.5 8h7M7 11.5h2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {current.label}
      </button>
      <div className={`c-pop ${open ? 'is-open' : ''}`} role="listbox" aria-label="Ordenar por">
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="option"
            aria-selected={s.key === value}
            className={s.key === value ? 'is-on' : ''}
            onClick={() => {
              animate(() => onChange(s.key));
              setOpen(false);
            }}
          >
            {s.label}
            {s.key === value && (
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path
                  d="M3 8.5l3.5 3.5L13 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Dial({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <span className="c-dial">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={r} className="c-dial-track" />
        <circle
          cx="32"
          cy="32"
          r={r}
          className="c-dial-arc"
          style={{ strokeDasharray: c, strokeDashoffset: c - (value / 100) * c }}
        />
      </svg>
      <b>{value}</b>
    </span>
  );
}

function Card({ p }: { p: Project }) {
  return (
    <a
      className="c-card"
      href={`/projects/${p.slug}`}
      data-tilt
      style={{ viewTransitionName: `card-${p.slug}` }}
    >
      <span className="c-card-sheen" aria-hidden="true" />
      <span className="c-card-top">
        <span className="c-card-logo">
          <img src={p.logo} alt="" loading="lazy" />
        </span>
        <span className="c-card-state" data-live={p.active}>
          <i></i>
          {p.active ? 'En activo' : 'Archivado'}
        </span>
      </span>

      <h3 className="c-card-name">{p.name}</h3>
      <p className="c-card-kind">
        <span className="c-tag">{KIND_LABEL[p.kind]}</span>
        <span>{range(p)}</span>
      </p>
      <p className="c-card-blurb">{p.blurb}</p>

      <span className="c-card-scores">
        <Dial value={overall(p)} />
        <span className="c-bars">
          {SCORE_META.map((m) => (
            <span className="c-bar" key={m.key} title={m.hint}>
              <span className="c-bar-key">{m.label}</span>
              <span className="c-bar-rail">
                <i style={{ width: `${p.scores[m.key]}%` }} />
              </span>
              <span className="c-bar-val">{p.scores[m.key]}</span>
            </span>
          ))}
        </span>
      </span>

      <span className="c-card-foot">
        <span>{p.hours.toLocaleString('es-ES')} h invertidas</span>
        <span className="c-card-go">
          Ver ficha
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M3 8h9.5M8.5 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </a>
  );
}

export default function Work() {
  const [sort, setSort] = useState<SortKey>('recent');
  const [status, setStatus] = useState<Status>('all');
  const [kinds, setKinds] = useState<ProjectKind[]>([]);

  const list = useMemo(() => arrange(projects, { sort, status, kinds }), [sort, status, kinds]);

  // Tilt hacia el cursor: dos variables CSS, el resto lo hace la hoja de estilos.
  useEffect(() => {
    if (reduced()) return;
    const move = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('[data-tilt]');
      if (!card) return;
      const b = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - b.left) / b.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - b.top) / b.height) * 100}%`);
      card.style.setProperty('--tx', `${((e.clientX - b.left) / b.width - 0.5) * 2}`);
      card.style.setProperty('--ty', `${((e.clientY - b.top) / b.height - 0.5) * 2}`);
    };
    document.addEventListener('pointermove', move, { passive: true });
    return () => document.removeEventListener('pointermove', move);
  }, []);

  const toggleKind = (k: ProjectKind) =>
    animate(() =>
      setKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k])),
    );

  return (
    <>
      <div className="c-controls">
        <Segmented options={STATUSES} value={status} onChange={setStatus} label="Estado" />

        <div className="c-chips" role="group" aria-label="Tipo de proyecto">
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
        </div>

        <SortPop value={sort} onChange={setSort} />
      </div>

      <p className="c-tally" aria-live="polite">
        Mostrando <b>{list.length}</b> de {projects.length} proyectos
      </p>

      <div className="c-grid">
        {list.map((p) => (
          <Card key={p.slug} p={p} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="c-empty">
          Nada encaja con esa combinación. Prueba a quitar un tipo o a mostrar todos.
        </p>
      )}
    </>
  );
}
