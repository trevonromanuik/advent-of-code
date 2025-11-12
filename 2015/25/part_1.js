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

const [, ROW, COL] = /row (\d+), column (\d+)/.exec(input).map((n, i) => {
  return i > 0 && parseInt(n);
});

function getNumber(x, y) {
  const row = x + y - 1;
  let n = 1;
  for (let i = 0; i < row; i++) {
    n += i;
  }
  return n + x - 1;
}

const N = getNumber(COL, ROW);

console.log({ COL, ROW, N });

const seen = {};
const nums = [];
let v = 20151125;
let loop_start, loop_end;
while (true) {
  if (seen[v]) {
    // found a loop
    console.log(`found loop from ${seen[v]} to ${nums.length}`);
    loop_start = seen[v];
    loop_end = nums.length;
    break;
  }
  seen[v] = nums.length;
  nums.push(v);
  v *= 252533
  v %= 33554393;
}

let n = N - loop_start;
n %= (loop_end - loop_start);
console.log(nums[n + loop_start - 1]);

console.log(`${hrTime() - start}µs`);