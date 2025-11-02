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

const WIDTH = 5;
const HEIGHT = 7;

const locks = [];
const keys = [];
input.replaceAll('\r', '').split('\n\n').map((schematic) => {
  const lines = schematic.split('\n');
  const sizes = new Array(WIDTH);
  if (lines[0][0] === '#') {
    for (let i = 0; i < WIDTH; i++) {
      for (let j = HEIGHT - 1; j >= 0; j--) {
        if (lines[j][i] === '#') {
          sizes[i] = j;
          break;
        }
      }
    }
    locks.push(sizes);
  } else {
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        if (lines[j][i] === '#') {
          sizes[i] = HEIGHT - j - 1;
          break;
        }
      }
    }
    keys.push(sizes);
  }
});

let count = 0;
for (let i = 0; i < locks.length; i++) {
  for (let j = 0; j < keys.length; j++) {
    let match = true;
    for (let k = 0; k < WIDTH; k++) {
      if (locks[i][k] + keys[j][k] >= 6) {
        match = false;
        break;
      }
    }
    if (match) count++;
  }
}
console.log({ count });

console.log(`${hrTime() - start}µs`);