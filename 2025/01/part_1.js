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

let n = 50;
let count = 0;
input.replaceAll('\r', '').split('\n').forEach((line) => {
  let d = parseInt(line.substring(1));
  if (line[0] === 'L') d *= -1;
  n += d;
  while (n < 0) n += 100;
  while (n > 99) n -= 100;
  if (n === 0) count++;
  if (test) console.log(line, n);
});

console.log({ count });

console.log(`${hrTime() - start}µs`);