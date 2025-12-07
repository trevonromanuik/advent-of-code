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

let n_splits = 0;
let cols = new Set([Math.floor(WIDTH / 2)])
for (let y = 1; y < HEIGHT; y++) {
  const new_cols = new Set();
  cols.forEach((x) => {
    if (lines[y][x] === '^') {
      n_splits++;
      new_cols.add(x - 1);
      new_cols.add(x + 1);
    } else {
      new_cols.add(x);
    }
  });
  cols = new_cols;
}

console.log({ n_splits });

console.log(JSON.stringify(summary(start)));