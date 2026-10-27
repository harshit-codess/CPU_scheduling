import fcfs from './fcfs.js';
import sjf from './sjf.js';
import srtf from './srtf.js';

export const ALGORITHMS = {
  fcfs: { name: 'First Come First Serve', short: 'FCFS', preemptive: false, run: fcfs },
  sjf: { name: 'Shortest Job First', short: 'SJF', preemptive: false, run: sjf },
  srtf: { name: 'Shortest Remaining Time First', short: 'SRTF', preemptive: true, run: srtf },
};
