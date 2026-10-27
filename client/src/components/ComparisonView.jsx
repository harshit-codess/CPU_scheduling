import GanttChart from './GanttChart.jsx';
import { ALGOS, fmt } from '../constants.js';

const KEYS = ['fcfs', 'sjf', 'srtf'];
const METRICS = [
  ['waiting', 'Average waiting time'],
  ['turnaround', 'Average turnaround time'],
  ['response', 'Average response time'],
];
const same = (a, b) => Math.abs(a - b) < 1e-9;

export default function ComparisonView({ results }) {
  const best = (m) => Math.min(...KEYS.map((k) => results[k].averages[m]));
  const totalTime = Math.max(...KEYS.map((k) => results[k].totalTime));
  const winners = KEYS.filter((k) => same(results[k].averages.waiting, best('waiting'))).map((k) => ALGOS[k].short);

  const cell = (k, m) => {
    const v = results[k].averages[m];
    return <td className={same(v, best(m)) ? 'best' : ''}>{fmt(v)}</td>;
  };

  return (
    <>
      <div className="algo-head">
        <div className="eyebrow">Comparison</div>
        <h2>All three on the same input</h2>
        <p>
          Lowest waiting time here: <b>{winners.join(' and ')}</b> at {fmt(best('waiting'))} units.
          Green marks the lowest value in each column; lower is better.
        </p>
      </div>

      <div className="tscroll">
        <table className="rtable">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Avg WT</th>
              <th>Avg TAT</th>
              <th>Avg RT</th>
              <th>Avg CT</th>
              <th>CPU util.</th>
              <th>Context switches</th>
            </tr>
          </thead>
          <tbody>
            {KEYS.map((k) => (
              <tr key={k}>
                <td>
                  <b>{ALGOS[k].short}</b> <span className="muted body-font">{ALGOS[k].name}</span>
                </td>
                {cell(k, 'waiting')}
                {cell(k, 'turnaround')}
                {cell(k, 'response')}
                {cell(k, 'completion')}
                <td>{fmt(results[k].cpuUtilization)}%</td>
                <td>{results[k].contextSwitches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="metric-grid">
        {METRICS.map(([m, label]) => {
          const max = Math.max(...KEYS.map((k) => results[k].averages[m])) || 1;
          return (
            <div className="metric" key={m}>
              <h3>{label}</h3>
              {KEYS.map((k) => {
                const v = results[k].averages[m];
                return (
                  <div className="barrow" key={k}>
                    <span>{ALGOS[k].short}</span>
                    <div className="bartrack">
                      <div className={`barfill${same(v, best(m)) ? ' win' : ''}`} style={{ width: `${(v / max) * 100}%` }} />
                    </div>
                    <b>{fmt(v)}</b>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="stack">
        {KEYS.map((k) => (
          <div className="stack-item" key={k}>
            <h3>{ALGOS[k].short} Gantt chart</h3>
            <GanttChart segments={results[k].segments} totalTime={totalTime} />
          </div>
        ))}
      </div>
    </>
  );
}
