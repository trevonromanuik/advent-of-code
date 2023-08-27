const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

let map = input.split('\r\n').map((line) => {
  return line.split('');
});
const nrows = map.length;
const ncols = map[0].length;

function check(y, x, max) {
  let count = 0;
  for(let dy = -1; dy <= 1; dy++) {
    for(let dx = -1; dx <= 1; dx++) {
      if(dy === 0 && dx === 0) continue;
      let ny = y + dy;
      let nx = x + dx;
      while(ny >= 0 && ny < nrows && nx >= 0 && nx < ncols) {
        if(map[ny][nx] === '#') {
          count++;
          break;
        } else if(map[ny][nx] === 'L') {
          break;
        } else {
          ny += dy;
          nx += dx;
        }
      }
      if(count >= max) break;
    }
    if(count >= max) break;
  }
  return count >= max;
}

for(let r = 0; r < 1000; r++) {
  let seat_count = 0;
  const changes = [];
  for(let y = 0; y < nrows; y++) {
    if(debug) console.log(map[y].join(''));
    for(let x = 0; x < ncols; x++) {
      if(map[y][x] === 'L') {
        if(!check(y, x, 1)) {
          changes.push({ y, x, c: '#' });
        }
      } else if(map[y][x] === '#') {
        seat_count++;
        if(check(y, x, 5)) {
          changes.push({ y, x, c: 'L' });
        }
      }
    }
  }
  if(!changes.length) {
    console.log(r, seat_count);
    break;
  } else {
    changes.forEach(({ y, x, c }) => {
      map[y][x] = c;
    });
  }
  if(debug) console.log('');
}