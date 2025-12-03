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
  const ratings = [];
  let last_i = -1;
  while (ratings.length < 12) {
    const l = 12 - ratings.length - 1;
    let max_n = -Infinity;
    let max_i = -Infinity;
    for (let i = last_i + 1; i < ns.length - l; i++) {
      if (ns[i] > max_n) {
        max_n = ns[i];
        max_i = i;
      }
    }
    ratings.push(max_n.toString());
    last_i = max_i;
  }
  const max_joltage = parseInt(ratings.join(''));
  if (test) console.log(line, max_joltage);
  return sum + max_joltage;
}, 0);

console.log({ sum });

console.log(JSON.stringify(summary(start)));