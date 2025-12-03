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
  const ns = line.split('').map(n => parseInt(n));
  let max_joltage = 0;
  for (let i = 0; i < ns.length; i++) {
    const t = ns[i] * 10;
    if (t < max_joltage) continue;
    for (let j = i + 1; j < ns.length; j++) {
      const joltage = t + ns[j];
      if (joltage > max_joltage) max_joltage = joltage;
    }
  }
  if (test) console.log(line, max_joltage);
  return sum + max_joltage;
}, 0);

console.log({ sum });

console.log(JSON.stringify(summary(start)));