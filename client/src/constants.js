// Colour hue for each process (by input order).
export const HUES = [214, 28, 152, 340, 268, 46, 190, 4, 104, 300];
export const hueOf = (index) => HUES[index % HUES.length];

export const MAX_PROCESSES = 10;

export const SAMPLE = [
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 9 },
  { id: 'P4', arrival: 3, burst: 5 },
  { id: 'P5', arrival: 28, burst: 3 },
];

export const ALGOS = {
  fcfs: {
    short: 'FCFS',
    name: 'First Come First Serve',
    mode: 'Non-preemptive',
    about:
      'Processes run in the order they arrive. Once a process gets the CPU it keeps it until its burst is finished, so a long job at the front makes everyone behind it wait.',
  },
  sjf: {
    short: 'SJF',
    name: 'Shortest Job First',
    mode: 'Non-preemptive',
    about:
      'Whenever the CPU becomes free, it picks the arrived process with the smallest burst time. A running process is never interrupted, even if a shorter one arrives.',
  },
  srtf: {
    short: 'SRTF',
    name: 'Shortest Remaining Time First',
    mode: 'Preemptive',
    about:
      'The preemptive version of SJF. At every time unit the CPU goes to the arrived process with the least remaining time, so a newly arrived short job can interrupt the running one.',
  },
};

export const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
