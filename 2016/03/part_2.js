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

const lines = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.trim().split(/\s+/).map((n) => parseInt(n));
});

let count = 0;
for (let i = 0; i < lines.length; i += 3) {
  const l0 = lines[i];
  const l1 = lines[i + 1];
  const l2 = lines[i + 2];
  for (let j = 0; j < 3; j++) {
    if (
      l0[j] + l1[j] > l2[j]
      && l0[j] + l2[j] > l1[j]
      && l1[j] + l2[j] > l0[j]
    ) count++;
  }
}

console.log({ count });

console.log(`${hrTime() - start}µs`);