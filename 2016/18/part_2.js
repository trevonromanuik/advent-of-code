const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
  const t = process.hrtime();
  return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const N_ROWS = test ? 10 : 400000;
const N_COLS = input.length;

const TRAPS = new Set(['^^.', '.^^', '^..', '..^']);

const rows = new Array(N_ROWS).fill(null);
rows[0] = input;
for (let i = 1; i < N_ROWS; i++) {
  const prev_row = '.' + rows[i - 1] + '.';
  const row = new Array(N_COLS).fill(null);
  for (let j = 1; j < N_COLS + 1; j++) {
    const s = prev_row.substring(j - 1, j + 2);
    row[j - 1] = TRAPS.has(s) ? '^' : '.';
  }
  rows[i] = row.join('');
}

let count = 0;
for (let i = 0; i < N_ROWS; i++) {
  const row = rows[i];
  if (test) console.log(row);
  for (let j = 0; j < N_COLS; j++) {
    if (row[j] === '.') count++;
  }
}

console.log({ count });

console.log(`${hrTime() - start}µs`);