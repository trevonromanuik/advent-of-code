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

const coords = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split(',').map(n => parseInt(n));
});

let max_area = -Infinity;
for (let i = 0; i < coords.length; i++) {
  const [xa, ya] = coords[i];
  for (let j = i + 1; j < coords.length; j++) {
    const [xb, yb] = coords[j];
    const area = (Math.abs(xa - xb) + 1) * (Math.abs(ya - yb) + 1);
    if (area > max_area) max_area = area;
  }
}

console.log({ max_area });

console.log(JSON.stringify(summary(start)));