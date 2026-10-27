import { hueOf } from '../constants.js';

// Draws the Gantt chart as a row of blocks, each sized by its duration.
export default function GanttChart({ segments, totalTime }) {
  const ticks = [...new Set([0, ...segments.map((s) => s.end)])];
  const pct = (t) => `${(t / totalTime) * 100}%`;

  return (
    <div className="gantt-scroll">
      <div className="gantt" style={{ minWidth: totalTime * 30 }}>
        <div className="bars">
          {segments.map((s, k) =>
            s.id === null ? (
              <div key={k} className="seg idle" style={{ flex: `0 0 ${pct(s.end - s.start)}` }} title={`Idle ${s.start}–${s.end}`}>
                idle
              </div>
            ) : (
              <div
                key={k}
                className="seg"
                style={{ flex: `0 0 ${pct(s.end - s.start)}`, '--h': hueOf(s.index) }}
                title={`${s.id}: ${s.start}–${s.end}`}
              >
                {s.id}
              </div>
            )
          )}
        </div>
        {ticks.map((t, k) => (
          <span
            key={t}
            className={`tick${k === 0 ? ' first' : ''}${k === ticks.length - 1 ? ' last' : ''}`}
            style={{ left: pct(t) }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
