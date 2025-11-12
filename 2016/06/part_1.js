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

const lines = input.replaceAll('\r', '').split('\n');
const counts = new Array(lines[0].length);
for (let i = 0; i < counts.length; i++) {
  counts[i] = {};
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (!counts[j][c]) counts[j][c] = 0;
    counts[j][c]++;
  }
}

const msg = Object.values(counts).map((counts) => {
  return Object.keys(counts).sort((a, b) => {
    return counts[a] > counts[b] ? -1 : 1;
  })[0];
}).join('');

console.log({ msg });

console.log(`${hrTime() - start}µs`);