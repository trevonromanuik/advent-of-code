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

const SECONDS = test ? 1000 : 2503;

let max_reindeer = null;
let max_distance = -Infinity;
const R = new RegExp(/^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/)
input.replaceAll('\r', '').split('\n').forEach((line) => {
  const r = R.exec(line);
  let [_s, n, sp, ft, rt] = r;
  sp = parseInt(sp); ft = parseInt(ft); rt = parseInt(rt);
  let d = Math.floor(SECONDS / (ft + rt)) * ft * sp;
  const rm = SECONDS % (ft + rt);
  d += Math.min(rm, ft) * sp;
  if (d > max_distance) {
    max_reindeer = n;
    max_distance = d;
  }
});

console.log({ max_reindeer, max_distance });

console.log(`${hrTime() - start}µs`);