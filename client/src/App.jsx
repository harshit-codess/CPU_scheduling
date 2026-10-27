import { useEffect, useState } from 'react';
import ProcessForm from './components/ProcessForm.jsx';
import AlgorithmTabs from './components/AlgorithmTabs.jsx';
import AlgorithmView from './components/AlgorithmView.jsx';
import ComparisonView from './components/ComparisonView.jsx';
import { runSchedule, runCompare } from './api.js';
import { SAMPLE } from './constants.js';

const STORAGE_KEY = 'cpu-sim-processes';

function loadSaved() {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(v) && v.length ? v : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [processes, setProcesses] = useState(() => loadSaved() || SAMPLE);
  const [view, setView] = useState('fcfs');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ask the backend for a new schedule whenever the input or tab changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(processes));
    } catch {
      /* storage unavailable: ignore */
    }

    let cancelled = false;
    const payload = processes.map((p) => ({
      id: p.id,
      arrival: p.arrival === '' ? NaN : Number(p.arrival),
      burst: p.burst === '' ? NaN : Number(p.burst),
    }));

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = view === 'compare' ? await runCompare(payload) : await runSchedule(view, payload);
        if (!cancelled) {
          setResult({ view, data });
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError({
            message:
              e instanceof TypeError
                ? 'Cannot reach the server. Start it with "npm run dev" in the project folder.'
                : e.message,
            row: e.row,
            field: e.field,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [processes, view]);

  const showing = result && result.view === view && !error;

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">Operating Systems · Process Scheduling</div>
        <h1>CPU Scheduling Simulator</h1>
        <p>
          Enter your processes, then see how First Come First Serve, Shortest Job First and Shortest
          Remaining Time First schedule them. Every change updates the Gantt chart and the metrics
          straight away.
        </p>
      </header>

      <div className="layout">
        <ProcessForm processes={processes} setProcesses={setProcesses} error={error} />

        <section className="results" aria-live="polite">
          <AlgorithmTabs view={view} setView={setView} />
          {error && !showing && <p className="muted">Fix the highlighted value to see the schedule.</p>}
          {showing && view === 'compare' && <ComparisonView results={result.data} />}
          {showing && view !== 'compare' && <AlgorithmView algoKey={view} result={result.data} />}
          {!showing && !error && loading && <p className="muted">Calculating…</p>}
        </section>
      </div>

      <footer>
        CPU Scheduling Simulator · B.Sc. Programme project, Department of Computer Science, Shyam Lal
        College, University of Delhi. Built with React, Express and Node.js. Ties are broken by
        earlier arrival, then by input order.
      </footer>
    </div>
  );
}
