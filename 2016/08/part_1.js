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

const WIDTH = test ? 7 : 50;
const HEIGHT = test ? 3 : 6;
const screen = new Array(HEIGHT).fill(null).map(() => {
  return new Array(WIDTH).fill(false);
});

input.replaceAll('\r', '').split('\n').forEach((line) => {
  const s = line.split(' ');
  if (s[0] === 'rect') {
    const [w, h] = s[1].split('x').map(n => parseInt(n));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        screen[y][x] = true;
      }
    }
  } else {
    const n = parseInt(s[2].split('=')[1]);
    const d = parseInt(s[4]);
    if (s[1] === "column") {
      const new_col = new Array(HEIGHT);
      for (let y = 0; y < HEIGHT; y++) {
        new_col[(y + d) % HEIGHT] = screen[y][n];
      }
      for (let y = 0; y < HEIGHT; y++) {
        screen[y][n] = new_col[y];
      }
    } else {
      const new_row = new Array(WIDTH);
      for (let x = 0; x < WIDTH; x++) {
        new_row[(x + d) % WIDTH] = screen[n][x];
      }
      for (let x = 0; x < WIDTH; x++) {
        screen[n][x] = new_row[x];
      }
    }
  }
  if (test) {
    console.log(line);
    console.log(screen.map((row) => {
      return row.map((b) => b ? '#' : '.').join('');
    }).join('\n'));
  }
});

let count = 0;
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (screen[y][x]) count++;
  }
}

console.log({ count });

console.log(`${hrTime() - start}µs`);