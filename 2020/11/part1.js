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

for(let r = 0; r < 1000; r++) {
  let seat_count = 0;
  const changes = [];
  for(let y = 0; y < nrows; y++) {
    if(debug) console.log(map[y].join(''));
    for(let x = 0; x < ncols; x++) {
      if(map[y][x] === 'L') {
        let found = false;
        for(let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if(ny < 0 || ny >= nrows) continue;
          for(let dx = -1; dx <= 1; dx++) {
            if(dy === 0 && dx === 0) continue;
            const nx = x + dx;
            if(nx < 0 || nx >= ncols) continue;
            if(map[ny][nx] === '#') {
              found = true;
              break;
            }
          }
          if(found) break;
        }
        if(!found) {
          changes.push({ y, x, c: '#' });
        }
      } else if(map[y][x] === '#') {
        seat_count++;
        let count = 0;
        for(let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if(ny < 0 || ny >= nrows) continue;
          for(let dx = -1; dx <= 1; dx++) {
            if(dy === 0 && dx === 0) continue;
            const nx = x + dx;
            if(nx < 0 || nx >= ncols) continue;
            if(map[ny][nx] === '#') {
              count++;
              if(count >= 4) break;
            }
          }
          if(count >= 4) break;
        }
        if(count >= 4) {
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