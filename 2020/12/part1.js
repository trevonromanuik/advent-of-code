const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

let dir = 0;
let x = 0, y = 0;
const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
input.split('\r\n').forEach((line) => {
  const n = parseInt(line.substring(1));
  switch(line[0]) {
    case 'N':
      y += n;
      break;
    case 'S':
      y -= n;
      break;
    case 'E':
      x += n;
      break;
    case 'W':
      x -= n;
      break;
    case 'L':
      dir -= n / 90;
      if(dir < 0) dir += 4;
      break;
    case 'R':
      dir += n / 90;
      if(dir >= 4) dir -= 4;
      break;
    case 'F':
      const [dx, dy] = dirs[dir];
      x += dx * n;
      y += dy * n;
      break;
  }
  console.log({ line, x, y, dir });
});
console.log(Math.abs(x) + Math.abs(y));