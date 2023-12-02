const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

let x = 0, y = 0;
let wx = 10, wy = 1;
input.split('\r\n').forEach((line) => {
  const n = parseInt(line.substring(1));
  switch(line[0]) {
    case 'N':
      wy += n;
      break;
    case 'S':
      wy -= n;
      break;
    case 'E':
      wx += n;
      break;
    case 'W':
      wx -= n;
      break;
    case 'L':
      for(let i = 0; i < n / 90; i++) {
        const tx = wx;
        wx = -wy;
        wy = tx;
      }
      break;
    case 'R':
      for(let i = 0; i < n / 90; i++) {
        const tx = wx;
        wx = wy;
        wy = -tx;
      }
      break;
    case 'F':
      x += wx * n;
      y += wy * n;
      break;
  }
  console.log({ line, x, y, wx, wy });
});
console.log(Math.abs(x) + Math.abs(y));