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

const count = input.replaceAll('\r', '').split('\n').reduce((count, line) => {
  const sides = line.trim().split(/\s+/).map((n) => parseInt(n));
  if (
    sides[0] + sides[1] > sides[2]
    && sides[0] + sides[2] > sides[1]
    && sides[1] + sides[2] > sides[0]
  ) count++;
  return count;
}, 0);

console.log({ count });

console.log(`${hrTime() - start}µs`);