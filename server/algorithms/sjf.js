import { pushSegment, buildResult, nextArrival } from './utils.js';

// Shortest Job First (non-preemptive)
// When the CPU is free, pick the arrived process with the smallest burst.
// Ties: earlier arrival first, then input order.
export default function sjf(processes) {
  const done = new Set();
  const segments = [];
  const firstRun = {};
  const completion = {};
  let time = 0;

  while (done.size < processes.length) {
    const ready = processes.filter((p) => !done.has(p.index) && p.arrival <= time);

    if (ready.length === 0) {
      const next = nextArrival(processes, (p) => !done.has(p.index));
      pushSegment(segments, { id: null, start: time, end: next }); // CPU idle
      time = next;
      continue;
    }

    ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.index - b.index);
    const p = ready[0];

    firstRun[p.index] = time;
    pushSegment(segments, { id: p.id, index: p.index, start: time, end: time + p.burst });
    time += p.burst;
    completion[p.index] = time;
    done.add(p.index);
  }

  return buildResult(processes, segments, firstRun, completion);
}
