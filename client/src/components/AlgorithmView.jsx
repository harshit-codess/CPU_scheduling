import GanttChart from './GanttChart.jsx';
import ResultTable from './ResultTable.jsx';
import { ALGOS, fmt } from '../constants.js';

export default function AlgorithmView({ algoKey, result }) {
  const a = ALGOS[algoKey];
  const order = result.segments.filter((s) => s.id !== null).map((s) => s.id);

  const stats = [
    ['Avg waiting', fmt(result.averages.waiting), 'units'],
    ['Avg turnaround', fmt(result.averages.turnaround), 'units'],
    ['Avg response', fmt(result.averages.response), 'units'],
    ['CPU utilisation', `${fmt(result.cpuUtilization)}%`, `${result.busyTime} of ${result.totalTime} units busy`],
    ['Throughput', fmt(result.throughput), 'processes per unit'],
  ];

  return (
    <>
      <div className="algo-head">
        <div className="eyebrow">{a.short}</div>
        <h2>{a.name}</h2>
        <p>{a.about}</p>
      </div>

      <div className="stats">
        {stats.map(([label, value, note]) => (
          <div className="stat" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>{note}</small>
          </div>
        ))}
      </div>

      <div className="block">
        <h3>Gantt chart</h3>
        <GanttChart segments={result.segments} totalTime={result.totalTime} />
        <p className="order">
          Execution order:{' '}
          {order.map((id, k) => (
            <span key={k}>
              {k > 0 && ' → '}
              <b>{id}</b>
            </span>
          ))}
        </p>
      </div>

      <div className="block">
        <h3>Process table</h3>
        <ResultTable rows={result.rows} averages={result.averages} />
      </div>
    </>
  );
}
