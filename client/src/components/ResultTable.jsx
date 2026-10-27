import { hueOf, fmt } from '../constants.js';

export default function ResultTable({ rows, averages }) {
  return (
    <div className="tscroll">
      <table className="rtable">
        <thead>
          <tr>
            <th>Process</th>
            <th><abbr title="Arrival Time">AT</abbr></th>
            <th><abbr title="Burst Time">BT</abbr></th>
            <th><abbr title="Completion Time">CT</abbr></th>
            <th><abbr title="Turnaround Time">TAT</abbr></th>
            <th><abbr title="Waiting Time">WT</abbr></th>
            <th><abbr title="Response Time">RT</abbr></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.index}>
              <td>
                <span className="pid" style={{ '--h': hueOf(r.index) }}>
                  <i />
                  {r.id}
                </span>
              </td>
              <td className="k">{r.arrival}</td>
              <td className="k">{r.burst}</td>
              <td>{r.completion}</td>
              <td>{r.turnaround}</td>
              <td>{r.waiting}</td>
              <td>{r.response}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Average</td>
            <td></td>
            <td></td>
            <td>{fmt(averages.completion)}</td>
            <td>{fmt(averages.turnaround)}</td>
            <td>{fmt(averages.waiting)}</td>
            <td>{fmt(averages.response)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
