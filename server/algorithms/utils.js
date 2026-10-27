// Shared helpers for all scheduling algorithms.

// Adds a Gantt block, merging it with the previous block if the same
// process (or idle time) simply continues.
export function pushSegment(segments, seg) {
  const last = segments[segments.length - 1];
  if (last && last.id === seg.id && last.end === seg.start) {
    last.end = seg.end;
  } else {
    segments.push(seg);
  }
}

// Turns raw scheduling output into the final result:
// per-process CT, TAT, WT, RT plus averages and overall metrics.
//   TAT = CT - AT,  WT = TAT - BT,  RT = first time on CPU - AT
export function buildResult(processes, segments, firstRun, completion) {
  const rows = processes.map((p) => {
    const ct = completion[p.index];
    const tat = ct - p.arrival;
    return {
      id: p.id,
      index: p.index,
      arrival: p.arrival,
      burst: p.burst,
      completion: ct,
      turnaround: tat,
      waiting: tat - p.burst,
      response: firstRun[p.index] - p.arrival,
    };
  });

  const n = rows.length;
  const totalTime = Math.max(...rows.map((r) => r.completion));
  const busyTime = processes.reduce((sum, p) => sum + p.burst, 0);
  const avg = (key) => rows.reduce((sum, r) => sum + r[key], 0) / n;

  return {
    segments,
    rows,
    totalTime,
    busyTime,
    averages: {
      completion: avg('completion'),
      turnaround: avg('turnaround'),
      waiting: avg('waiting'),
      response: avg('response'),
    },
    cpuUtilization: (busyTime / totalTime) * 100,
    throughput: n / totalTime,
    contextSwitches: segments.filter((s) => s.id !== null).length - 1,
  };
}

// Earliest arrival among processes that are not finished yet.
export function nextArrival(processes, isPending) {
  return Math.min(...processes.filter(isPending).map((p) => p.arrival));
}
