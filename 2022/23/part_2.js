const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const map = input.split('\r\n').map((line) => {
  return line.split('');
});

function drawMap() {
  for(let i = 0; i < map.length; i++) {
    console.log(map[i].join(''));
  }
  console.log();
}

let num_rows = map.length;
let num_cols = map[0].length;

const dirs = ['N', 'S', 'W', 'E'];

if(debug) console.log(`== Initial State ==`);
if(debug) drawMap();

const STEPS = 10000;
for(let step = 0; step < STEPS; step++) {
  const moves = {};
  for(let y = 0; y < num_rows; y++) {
    for(let x = 0; x < num_cols; x++) {
      if(map[y][x] === '#') {
        const nw = (y === 0 || x === 0) ? false : (map[y - 1][x - 1]) === '#';
        const n = (y === 0) ? false : (map[y - 1][x]) === '#';
        const ne = (y === 0 || x === num_cols - 1) ? false : (map[y - 1][x + 1]) === '#';
        const w = (x === 0) ? false : (map[y][x - 1]) === '#';
        const e = (x === num_cols - 1) ? false : (map[y][x + 1]) === '#';
        const sw = (y === num_rows - 1 || x === 0) ? false : (map[y + 1][x - 1]) === '#';
        const s = (y === num_rows - 1) ? false : (map[y + 1][x]) === '#';
        const se = (y === num_rows - 1 || x === num_cols - 1) ? false : (map[y + 1][x + 1]) === '#';
        if([nw, n, ne, w, e, sw, s, se].some(b => b)) {
          for(let k = 0; k < dirs.length; k++) {
            const dir = dirs[(step + k) % dirs.length];
            // console.log(`checking dir ${dir}`);
            const [bools, ny, nx] = {
              'N': [[nw, n, ne], y - 1, x],
              'S': [[sw, s, se], y + 1, x],
              'W': [[nw, w, sw], y, x - 1],
              'E': [[ne, e, se], y, x + 1],
            }[dir];
            if(bools.every(b => !b)) {
              const nkey = `${nx},${ny}`;
              if(!moves[nkey]) moves[nkey] = { nx, ny, from: [{ x, y }] };
              else moves[nkey].from.push({ x, y });
              break;
            }
          }
        }
      }
    }
  }
  
  const move_keys = Object.keys(moves);
  let dx = 0;
  let dy = 0;
  let did_move = false;
  for(let i = 0; i < move_keys.length; i++) {
    let { nx, ny, from } = moves[move_keys[i]];
    if(from.length === 1) {
      let { x, y } = from[0];

      // console.log(`${x},${y} -> ${nx},${ny}`);

      x += dx;
      nx += dx;
      y += dy;
      ny += dy;

      if(nx < 0) {
        // console.log(`unshifting col`);
        for(let j = 0; j < num_rows; j++) {
          map[j].unshift('.');
        }
        dx++;
        x++;
        nx++;
        num_cols++;
      } else if(nx >= num_cols) {
        // console.log(`pushing col`);
        for(let j = 0; j < num_rows; j++) {
          map[j].push('.');
        }
        num_cols++;
      }

      if(ny < 0) {
        // console.log(`unshifting row`);
        const row = new Array(num_cols);
        for(let j = 0; j < num_cols; j++) {
          row[j] = '.';
        }
        map.unshift(row);
        dy++;
        y++;
        ny++;
        num_rows++;
      } else if(ny >= num_rows) {
        // console.log(`pushing row`);
        const row = new Array(num_cols);
        for(let j = 0; j < num_cols; j++) {
          row[j] = '.';
        }
        map.push(row);
        num_rows++;
      }

      map[y][x] = '.';
      map[ny][nx] = '#';
      did_move = true;
    }
  }
  
  if(debug) console.log(`\n== End of Step ${step + 1} ==`);
  if(debug) drawMap();

  if(!did_move) {
    console.log(step + 1);
    break;
  }
}