const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function summary(start) {
  const time = `${hrTime() - start}µs`;
  const usage = memoryUsage();
  usage['time'] = time;
  return usage;
}

function memoryUsage() {
  const usage = process.memoryUsage();
  Object.keys(usage).forEach((key) => {
    usage[key] = `${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`
  });
  return usage;
}

function hrTime() {
  const t = process.hrtime();
  return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const lines = input.replaceAll('\r', '').split('\n');
const HEIGHT = lines.length;
const WIDTH = Math.max(...lines.map(l => l.length));
const opline = lines[HEIGHT - 1];

let sum = 0;
let v = 0, op = '';
for (let x = 0; x < WIDTH; x++) {
  let s = '';
  for (let y = 0; y < HEIGHT - 1; y++) {
    s += lines[y][x] || ' ';
  }
  const n = parseInt(s);
  if (isNaN(n)) continue;
  if (opline[x] !== ' ') {
    sum += v;
    v = n;
    op = opline[x];
  } else {
    if (op === '*') {
      v *= n;
    } else {
      v += n;
    }
  }
}
sum += v;

console.log({ sum });

console.log(JSON.stringify(summary(start)));