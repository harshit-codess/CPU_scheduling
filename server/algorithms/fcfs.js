import { pushSegment, buildResult } from './utils.js';

// First Come First Serve (non-preemptive)
// Processes run in order of arrival; ties go to the one entered first.
export default function fcfs(processes) {
  const order = [...processes].sort((a, b) => a.arrival - b.arrival || a.index - b.index);
  const segments = [];
  const firstRun = {};
  const completion = {};
  let time = 0;

  for (const p of order) {
    if (time < p.arrival) {
      pushSegment(segments, { id: null, start: time, end: p.arrival }); // CPU idle
      time = p.arrival;
    }
    firstRun[p.index] = time;
    pushSegment(segments, { id: p.id, index: p.index, start: time, end: time + p.burst });
    time += p.burst;
    completion[p.index] = time;
  }

  return buildResult(processes, segments, firstRun, completion);
}
