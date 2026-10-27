import { Router } from 'express';
import { ALGORITHMS } from '../algorithms/index.js';

const router = Router();
const MAX_PROCESSES = 10;

// Checks the request body and returns { processes } or { error }.
function parseProcesses(body) {
  const list = body?.processes;
  if (!Array.isArray(list) || list.length === 0) {
    return { error: 'Send at least one process.' };
  }
  if (list.length > MAX_PROCESSES) {
    return { error: `You can schedule up to ${MAX_PROCESSES} processes.` };
  }

  const seen = new Set();
  const processes = [];

  for (let i = 0; i < list.length; i++) {
    const raw = list[i] || {};
    const id = String(raw.id ?? '').trim();
    // Empty boxes arrive as null or "": treat them as missing, not as 0.
    const toNumber = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
    const arrival = toNumber(raw.arrival);
    const burst = toNumber(raw.burst);
    const label = id || `row ${i + 1}`;

    if (!id) return { error: `Row ${i + 1} needs a process ID.`, row: i, field: 'id' };
    if (seen.has(id)) return { error: `Process ID ${id} is used twice. Give each process its own ID.`, row: i, field: 'id' };
    if (!Number.isInteger(arrival) || arrival < 0)
      return { error: `Arrival time of ${label} must be a whole number, 0 or more.`, row: i, field: 'arrival' };
    if (!Number.isInteger(burst) || burst < 1)
      return { error: `Burst time of ${label} must be a whole number, 1 or more.`, row: i, field: 'burst' };

    seen.add(id);
    processes.push({ id, arrival, burst, index: i });
  }
  return { processes };
}

// GET /api/algorithms -> list of available algorithms
router.get('/algorithms', (req, res) => {
  res.json(
    Object.entries(ALGORITHMS).map(([key, a]) => ({
      key,
      name: a.name,
      short: a.short,
      preemptive: a.preemptive,
    }))
  );
});

// POST /api/schedule  { algorithm: "fcfs" | "sjf" | "srtf", processes: [...] }
router.post('/schedule', (req, res) => {
  const algo = ALGORITHMS[req.body?.algorithm];
  if (!algo) {
    return res.status(400).json({ error: 'Choose an algorithm: fcfs, sjf or srtf.' });
  }
  const parsed = parseProcesses(req.body);
  if (parsed.error) return res.status(400).json(parsed);

  res.json({ algorithm: req.body.algorithm, ...algo.run(parsed.processes) });
});

// POST /api/compare  { processes: [...] } -> results of all three algorithms
router.post('/compare', (req, res) => {
  const parsed = parseProcesses(req.body);
  if (parsed.error) return res.status(400).json(parsed);

  const results = {};
  for (const [key, algo] of Object.entries(ALGORITHMS)) {
    results[key] = algo.run(parsed.processes);
  }
  res.json(results);
});

export default router;
