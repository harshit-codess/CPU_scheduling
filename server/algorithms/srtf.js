import { pushSegment, buildResult, nextArrival } from './utils.js';

// Shortest Remaining Time First (preemptive SJF)
// Every time unit, the CPU goes to the arrived process with the least
// remaining time. Ties: earlier arrival first, then input order.
export default function srtf(processes) {
  const remaining = {};
  processes.forEach((p) => (remaining[p.index] = p.burst));

  const segments = [];
  const firstRun = {};
  const completion = {};
  let time = 0;
  let left = processes.length;

  while (left > 0) {
    const ready = processes.filter((p) => remaining[p.index] > 0 && p.arrival <= time);

    if (ready.length === 0) {
      const next = nextArrival(processes, (p) => remaining[p.index] > 0);
      pushSegment(segments, { id: null, start: time, end: next }); // CPU idle
      time = next;
      continue;
    }

    ready.sort(
      (a, b) => remaining[a.index] - remaining[b.index] || a.arrival - b.arrival || a.index - b.index
    );
    const p = ready[0];

    if (firstRun[p.index] === undefined) firstRun[p.index] = time;

    // Run for one time unit, then re-check (this is where preemption happens).
    pushSegment(segments, { id: p.id, index: p.index, start: time, end: time + 1 });
    time += 1;
    remaining[p.index] -= 1;

    if (remaining[p.index] === 0) {
      completion[p.index] = time;
      left--;
    }
  }

  return buildResult(processes, segments, firstRun, completion);
}
