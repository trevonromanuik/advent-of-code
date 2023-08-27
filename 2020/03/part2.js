const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const map = input.split('\r\n').map((line) => {
  return line.split('');
});
const nrows = map.length;
const ncols = map[0].length;

const p = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
].reduce((p, [dx, dy]) => {
  let count = 0;
  let x = 0, y = 0;
  while(y < nrows) {
    if(map[y][x % ncols] === '#') count++;
    x += dx;
    y += dy;
  }
  console.log(count);
  return p * count;
}, 1);
console.log(p);