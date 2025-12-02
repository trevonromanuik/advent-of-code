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

const FACTORS = {};
function getFactors(n) {
  if (!FACTORS[n]) {
    FACTORS[n] = [];
    for (let i = 1; i < n; i++) {
      const q = n / i;
      if (q === Math.floor(q)) {
        FACTORS[n].push([i, q]);
      }
    }
  }
  return FACTORS[n];
}

const ranges = input.split(',').map((s) => {
  return s.split('-').map((n) => parseInt(n));
});

let sum = 0;
ranges.forEach(([min, max]) => {
  for (let n = min; n <= max; n++) {
    const s = n.toString();
    const factors = getFactors(s.length);
    for (let i = 0; i < factors.length; i++) {
      let match = true;
      const [a, b] = factors[i];
      for (let index = 0; index < a; index++) {
        if (!match) break;
        for (let offset = 1; offset < b; offset++) {
          if (s[index] !== s[index + (offset * a)]) {
            match = false;
            break;
          }
        }
      }
      if (match) {
        if (test) console.log(n);
        sum += n;
        break;
      }
    }
  }
});

console.log({ sum });

console.log(`${hrTime() - start}µs`);