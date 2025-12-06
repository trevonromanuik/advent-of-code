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

const grid = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.trim().split(/\s+/);
});

const HEIGHT = grid.length;
const WIDTH = grid[0].length;

let sum = 0;
for (let x = 0; x < WIDTH; x++) {
  let v = parseInt(grid[0][x]);
  const op = grid[HEIGHT - 1][x];
  for (let y = 1; y < HEIGHT - 1; y++) {
    if (op === '*') {
      v *= parseInt(grid[y][x]);
    } else {
      v += parseInt(grid[y][x]);
    }
  }
  sum += v;
}

console.log({ sum });

console.log(JSON.stringify(summary(start)));