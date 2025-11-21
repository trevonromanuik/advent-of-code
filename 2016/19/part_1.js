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

const N_ELVES = parseInt(input);
const elves = new Array(N_ELVES).fill(true);
let done = false;
let i = -1;
while (!done) {
  i = (i + 1) % elves.length;
  if (!elves[i]) continue;
  let j = i;
  while (!done) {
    j = (j + 1) % elves.length;
    if (!elves[j]) continue;
    if (j === i) {
      console.log({ i: i + 1 });
      done = true;
    } else {
      elves[j] = false;
      i = j;
    }
    break;
  }
}

console.log(`${hrTime() - start}µs`);