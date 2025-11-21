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

function getWinner(n) {
  let i = 0;
  let root = 1;
  while (n / root > 3) {
    i += 1;
    root *= 3;
  }
  const d = n - root;
  let w = d;
  if (d > root) w += d - root;
  console.log(n, w);
}

const N_ELVES = parseInt(input);
getWinner(N_ELVES);

console.log(`${hrTime() - start}µs`);