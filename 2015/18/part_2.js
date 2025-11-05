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

let map = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split('').map((c) => {
    return c === '#';
  });
});

function printMap(map) {
  console.log(map.map((row) => {
    return row.map((b) => {
      return b ? '#' : '.';
    }).join('');
  }).join('\n'));
}

if (test) console.log(`initial state:`);
if (test) printMap(map);

const HEIGHT = map.length;
const WIDTH = map[0].length;

// turn the corner lights on
map[0][0] = true;
map[0][WIDTH - 1] = true;
map[HEIGHT - 1][0] = true;
map[HEIGHT - 1][WIDTH - 1] = true;

const STEPS = test ? 5 : 100;

for (let i = 0; i < STEPS; i++) {
  const new_map = new Array(HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    new_map[y] = new Array(WIDTH);
    for (let x = 0; x < WIDTH; x++) {
      if (
        (y === 0 || y === HEIGHT - 1)
        && (x === 0 || x === WIDTH - 1)
      ) {
        new_map[y][x] = true;
        continue;
      }
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (map[ny]?.[nx]) count++;
        }
      }
      new_map[y][x] = map[y][x] ?
        (count === 2 || count === 3) :
        (count === 3);
    }
  }
  map = new_map;
  if (test) console.log(`\nafter ${i + 1} steps:`);
  if (test) printMap(map);
}

const count = map.reduce((count, row) => {
  return count + row.reduce((count, b) => {
    return count + (b ? 1 : 0);
  }, 0);
}, 0);
console.log({ count });

console.log(`${hrTime() - start}µs`);