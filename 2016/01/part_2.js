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

const steps = input.split(', ').map((l) => {
  return [l[0], parseInt(l.substring(1))];
});

if (test) console.log({ steps });

const DIRS = [
  [0, +1], // N
  [+1, 0], // E
  [0, -1], // S
  [-1, 0], // W
];

const seen = new Set();
let di = 0;
let x = 0;
let y = 0;
let done = false;
for (let i = 0; i < steps.length; i++) {
  if (done) break;
  di = steps[i][0] === 'L' ? di - 1 : di + 1;
  if (di >= DIRS.length) di -= DIRS.length;
  if (di < 0) di += DIRS.length;
  const [dx, dy] = DIRS[di];
  for (let j = 0; j < steps[i][1]; j++) {
    x += dx;
    y += dy;
    const k = `${x},${y}`;
    if (seen.has(k)) {
      console.log(k);
      done = true;
      break;
    }
    seen.add(k);
  }
}
console.log(Math.abs(x) + Math.abs(y));

console.log(`${hrTime() - start}µs`);