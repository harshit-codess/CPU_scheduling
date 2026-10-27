# CPU Scheduling Simulator

A web application that simulates three CPU scheduling algorithms and compares them on the same set of processes:

- **FCFS**: First Come First Serve (non-preemptive)
- **SJF**: Shortest Job First (non-preemptive)
- **SRTF**: Shortest Remaining Time First (preemptive)

For each algorithm it shows a Gantt chart, the execution order, and a table of Completion Time (CT), Turnaround Time (TAT), Waiting Time (WT) and Response Time (RT), with averages, CPU utilisation and throughput. The **Compare all** tab runs all three algorithms on the same input.

B.Sc. Programme project, Department of Computer Science, Shyam Lal College, University of Delhi.

## Tech stack

Built on the MERN stack without the database (no MongoDB is needed, because nothing is stored).

| Layer | Technology | Role |
|---|---|---|
| Frontend | **React** (with Vite) | Process input form, tabs, Gantt chart, result tables |
| Backend | **Express.js** on **Node.js** | REST API that runs the scheduling algorithms |
| Styling | CSS | Layout, light/dark mode, Gantt chart blocks |

## Requirements

- Node.js 18 or newer (comes with npm)

## How to run

Open a terminal in this folder and run:

```bash
npm run install-all   # installs packages for root, server and client (first time only)
npm run dev           # starts the server (port 5000) and React app (port 5173)
```

Then open **http://localhost:5173** in your browser.

### Production build (one server)

```bash
npm run build   # builds the React app into client/dist
npm start       # Express serves the API and the built app
```

Then open **http://localhost:5000**.

### Test the algorithms

```bash
npm test
```

This checks all three algorithms against the standard textbook example
(P1–P4 with arrival 0, 1, 2, 3 and burst 8, 4, 9, 5). The expected average waiting times are FCFS 8.75, SJF 7.75 and SRTF 6.5.

## Project structure

```
cpu-scheduler-mern/
├── package.json            # scripts to install and run everything
├── server/                 # Express + Node.js backend
│   ├── index.js            # starts the server, serves the built React app
│   ├── routes/schedule.js  # API routes and input validation
│   ├── algorithms/
│   │   ├── fcfs.js         # First Come First Serve
│   │   ├── sjf.js          # Shortest Job First
│   │   ├── srtf.js         # Shortest Remaining Time First
│   │   ├── utils.js        # CT, TAT, WT, RT and averages
│   │   └── index.js        # list of algorithms
│   └── test.js             # textbook test case
└── client/                 # React frontend (Vite)
    ├── index.html
    ├── vite.config.js      # forwards /api to the Express server in development
    └── src/
        ├── main.jsx
        ├── App.jsx         # page layout, calls the API
        ├── api.js          # fetch calls to the backend
        ├── constants.js    # algorithm descriptions, colours, sample data
        ├── styles.css
        └── components/
            ├── ProcessForm.jsx     # process input table
            ├── AlgorithmTabs.jsx   # FCFS / SJF / SRTF / Compare tabs
            ├── AlgorithmView.jsx   # results for one algorithm
            ├── GanttChart.jsx
            ├── ResultTable.jsx
            └── ComparisonView.jsx  # all three side by side
```

## API

All endpoints accept and return JSON.

**`POST /api/schedule`** runs one algorithm.

```json
{
  "algorithm": "srtf",
  "processes": [
    { "id": "P1", "arrival": 0, "burst": 8 },
    { "id": "P2", "arrival": 1, "burst": 4 }
  ]
}
```

The response contains `segments` (the Gantt chart blocks), `rows` (CT, TAT, WT, RT per process), `averages`, `cpuUtilization`, `throughput` and `contextSwitches`.

**`POST /api/compare`** takes `{ "processes": [...] }` and returns the results of all three algorithms, keyed `fcfs`, `sjf` and `srtf`.

**`GET /api/algorithms`** lists the available algorithms. **`GET /api/health`** returns `{ "status": "ok" }`.

Invalid input returns status 400 with an `error` message, plus the `row` and `field` that caused it.

## Scheduling rules

- Arrival and burst times are whole numbers (arrival ≥ 0, burst ≥ 1).
- When two processes tie, the one that arrived earlier goes first, then the one entered first.
- If no process has arrived yet, the CPU is shown as idle.
- Formulas: TAT = CT − AT, WT = TAT − BT, RT = first time on CPU − AT, CPU utilisation = busy time ÷ total time.
