const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

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

const ranges = input.split(',').map((s) => {
  return s.split('-').map((n) => parseInt(n));
});

let sum = 0;
ranges.forEach(([min, max]) => {
  for (let n = min; n <= max; n++) {
    const s = n.toString();
    if (s.length % 2 !== 0) continue;
    const q = s.length / 2;
    let match = true;
    for (let i = 0; i < q; i++) {
      if (s[i] !== s[i + q]) {
        match = false;
        break;
      }
    }
    if (match) {
      if (test) console.log(n);
      sum += n;
    }
  }
});

console.log({ sum });

console.log(`${hrTime() - start}µs`);
console.log(memoryUsage());