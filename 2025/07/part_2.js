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
const WIDTH = lines[0].length;

let cols = { [Math.floor(WIDTH / 2)]: 1 };
for (let y = 1; y < HEIGHT; y++) {
  const new_cols = {};
  Object.keys(cols).forEach((x) => {
    x = parseInt(x);
    const nxs = lines[y][x] === '^' ? [x - 1, x + 1] : [x];
    nxs.forEach((nx) => {
      if (!new_cols[nx]) new_cols[nx] = 0;
      new_cols[nx] += cols[x];
    });
  });
  cols = new_cols;
}

const sum = Object.values(cols).reduce((sum, n) => sum + n);
console.log({ sum });

console.log(JSON.stringify(summary(start)));