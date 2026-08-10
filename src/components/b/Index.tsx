import { useMemo, useState } from 'react';
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

/** Fila de controles con forma de sumario: opciones como texto, no como widgets. */
function Row<T extends string>({
  label,
  options,
  isOn,
  onPick,
}: {
  label: string;
  options: { key: T; label: string }[];
  isOn: (k: T) => boolean;
  onPick: (k: T) => void;
}) {
  return (
    <div className="b-row">
      <span className="b-row-label">{label}</span>
      <ul className="b-row-opts">
        {options.map((o) => (
          <li key={o.key}>
            <button
              type="button"
              aria-pressed={isOn(o.key)}
              className={isOn(o.key) ? 'is-on' : ''}
              onClick={() => onPick(o.key)}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Index() {
  const [sort, setSort] = useState<SortKey>('recent');
  const [status, setStatus] = useState<Status>('all');
  const [kinds, setKinds] = useState<ProjectKind[]>([]);

  const list = useMemo(() => arrange(projects, { sort, status, kinds }), [sort, status, kinds]);

  return (
    <>
      <div className="b-controls">
        <Row label="Ordenar por" options={SORTS} isOn={(k) => k === sort} onPick={setSort} />
        <Row label="Mostrar" options={STATUSES} isOn={(k) => k === status} onPick={setStatus} />
        <Row
          label="Tipo"
          options={KINDS.map((k) => ({ key: k, label: KIND_LABEL[k] }))}
          isOn={(k) => kinds.includes(k)}
          onPick={(k) =>
            setKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))
          }
        />
        <p className="b-tally" aria-live="polite">
          {list.length} de {projects.length} fichas
          {kinds.length > 0 && (
            <button type="button" className="b-reset" onClick={() => setKinds([])}>
              quitar tipos
            </button>
          )}
        </p>
      </div>

      <ul className="b-plates">
        {list.map((p) => (
          <li key={p.slug}>
            <a className="b-plate" href={`/projects/${p.slug}`}>
              <span className="b-plate-img">
                <img src={p.logo} alt="" loading="lazy" />
              </span>

              <span className="b-plate-head">
                <span className="b-plate-year">{range(p)}</span>
                <span className="b-plate-state" data-live={p.active}>
                  {p.active ? 'En activo' : 'Archivado'}
                </span>
              </span>

              <h3 className="b-plate-name">{p.name}</h3>
              <p className="b-plate-kind">
                {KIND_LABEL[p.kind]} · {p.stack.slice(0, 3).join(', ')}
              </p>
              <p className="b-plate-blurb">{p.blurb}</p>

              <dl className="b-specs">
                {SCORE_META.map((m) => (
                  <div key={m.key} title={m.hint}>
                    <dt>{m.label}</dt>
                    <dd>{p.scores[m.key]}</dd>
                  </div>
                ))}
              </dl>

              <span className="b-plate-foot">
                <span className="b-plate-hours">{p.hours.toLocaleString('es-ES')} horas</span>
                <span className="b-plate-overall">
                  {overall(p)}
                  <em>global</em>
                </span>
                <span className="b-plate-go">Leer la ficha →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="b-empty">
          No queda ninguna ficha con esas condiciones. Prueba a quitar un tipo.
        </p>
      )}
    </>
  );
}
