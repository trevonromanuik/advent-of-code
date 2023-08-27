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

let count = 0;
let x = 0, y = 0;
while(y < nrows) {
  if(map[y][x % ncols] === '#') count++;
  x += 3;
  y += 1;
}
console.log(count);