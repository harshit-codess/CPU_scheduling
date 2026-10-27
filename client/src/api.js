// Talks to the Express backend.
async function post(path, body) {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ error: 'The server sent an unreadable response.' }));
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong on the server.');
    err.row = data.row;
    err.field = data.field;
    throw err;
  }
  return data;
}

export const runSchedule = (algorithm, processes) => post('/schedule', { algorithm, processes });
export const runCompare = (processes) => post('/compare', { processes });
