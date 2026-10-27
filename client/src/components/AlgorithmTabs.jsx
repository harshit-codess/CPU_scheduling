import { ALGOS } from '../constants.js';

const TABS = [
  ...Object.entries(ALGOS).map(([key, a]) => ({ key, label: a.short, sub: a.mode })),
  { key: 'compare', label: 'Compare all', sub: 'Same input' },
];

export default function AlgorithmTabs({ view, setView }) {
  return (
    <div className="tabs" role="tablist" aria-label="Algorithm">
      {TABS.map((t) => (
        <button
          key={t.key}
          className="tab"
          role="tab"
          aria-selected={view === t.key}
          onClick={() => setView(t.key)}
        >
          {t.label}
          <small>{t.sub}</small>
        </button>
      ))}
    </div>
  );
}
