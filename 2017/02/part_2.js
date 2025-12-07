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

const sum = input.replaceAll('\r', '').split('\n').reduce((sum, line) => {
  const ns = line.split(' ').map((n) => parseInt(n));
  for (let i = 0; i < ns.length; i++) {
    const ni = ns[i];
    for (let j = i + 1; j < ns.length; j++) {
      const nj = ns[j];
      const a = Math.max(ni, nj);
      const b = Math.min(ni, nj);
      if (a % b === 0) return sum + (a / b);
    }
  }
}, 0);

console.log({ sum });

console.log(JSON.stringify(summary(start)));