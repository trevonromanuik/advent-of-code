const fs = require('fs');
const path = require('path');

const debug = true;
const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const lines = input.split('\r\n');
const moves = lines.pop();
lines.pop();
const num_cols = Math.max(...lines.map((line) => {
  return line.length;
}));
const map = lines.map((line) => {
  const row = line.split('');
  for(let i = row.length; i < num_cols; i++) {
    row.push(' ');
  }
  return row;
});
const num_rows = map.length;
let x = map[0].findIndex((v) => {
  return v === '.';
});
let y = 0;
let dir = '>';
for(let i = 0; i < moves.length; i++) {
  switch(moves[i]) {
    case 'L':
      if(debug) console.log('turning left');
      switch(dir) {
        case '^':
          dir = '<';
          break;
        case 'v':
          dir = '>';
          break;
        case '<':
          dir = 'v';
          break;
        case '>':
          dir = '^';
          break;
      }
      break;
    case 'R':
      if(debug) console.log('turning right');
      switch(dir) {
        case '^':
          dir = '>';
          break;
        case 'v':
          dir = '<';
          break;
        case '<':
          dir = '^';
          break;
        case '>':
          dir = 'v';
          break;
      }
      break;
    default:
      let j;
      for(j = i; j < moves.length; j++) {
        if(moves[j] === 'L' || moves[j] === 'R') break;
      }
      const n = parseInt(moves.substring(i, j));
      if(debug) console.log(`moving ${dir} ${n}`);
      i = j - 1;
      let dx = 0, dy = 0;
      switch(dir) {
        case '^':
          dy = -1;
          break;
        case 'v':
          dy = 1;
          break;
        case '<':
          dx = -1;
          break;
        case '>':
          dx = +1;
          break;
      }
      for(j = 0; j < n; j++) {
        let nx = x + dx;
        if(nx < 0) nx = num_cols - 1;
        if(nx >= num_cols) nx = 0;
        let ny = y + dy;
        if(ny < 0) ny = num_rows - 1;
        if(ny >= num_rows) ny = 0;
        while(map[ny][nx] === ' ') {
          nx += dx;
          if(nx < 0) nx = num_cols - 1;
          if(nx >= num_cols) nx = 0;
          ny += dy;
          if(ny < 0) ny = num_rows - 1;
          if(ny >= num_rows) ny = 0;
        }
        map[y][x] = dir;
        if(map[ny][nx] === '#') {
          break;
        }
        x = nx;
        y = ny;
      }
  }
}
map.forEach((row) => {
  console.log(row.join(''));
});
const dir_score = {
  '^': 3,
  'v': 1,
  '<': 2,
  '>': 0,
}[dir];
const code = ((y + 1) * 1000) + ((x + 1) * 4) + dir_score;
console.log(code);