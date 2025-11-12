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

const PAD = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const DIRS = {
  'U': [0, -1],
  'R': [+1, 0],
  'D': [0, +1],
  'L': [-1, 0],
}

let x = 1, y = 1;
const code = [];
const lines = input.replaceAll('\r', '').split('\n');
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    const [dx, dy] = DIRS[lines[i][j]];
    x += dx;
    if (x < 0) x = 0;
    if (x > 2) x = 2;
    y += dy;
    if (y < 0) y = 0;
    if (y > 2) y = 2;
  }
  code.push(PAD[y][x]);
}

console.log(code.join(''));

console.log(`${hrTime() - start}µs`);