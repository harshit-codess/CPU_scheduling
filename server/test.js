// Quick check against the standard textbook example.
// Run with: npm test
import assert from 'node:assert/strict';
import { ALGORITHMS } from './algorithms/index.js';

const processes = [
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 9 },
  { id: 'P4', arrival: 3, burst: 5 },
].map((p, index) => ({ ...p, index }));

const expectedWaiting = { fcfs: 8.75, sjf: 7.75, srtf: 6.5 };

for (const [key, algo] of Object.entries(ALGORITHMS)) {
  const r = algo.run(processes);
  assert.equal(r.averages.waiting, expectedWaiting[key], `${key} average waiting time`);
  const order = r.segments.map((s) => `${s.id ?? 'idle'}(${s.start}-${s.end})`).join(' ');
  console.log(`${algo.short.padEnd(5)} avg WT ${r.averages.waiting}  ${order}`);
}
console.log('All tests passed.');
