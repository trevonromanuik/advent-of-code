const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function summary(start) {
  const time = `${hrTime() - start}µs`;
  const usage = memoryUsage();
  usage['time'] = time;
  return usage;
}

function memoryUsage() {
  const usage = process.memoryUsage();
  Object.keys(usage).forEach((key) => {
    usage[key] = `${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`
  });
  return usage;
}

function hrTime() {
  const t = process.hrtime();
  return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const map = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split('');
});

const HEIGHT = map.length;
const WIDTH = map[0].length;

let count = 0;
let to_remove;
do {
  to_remove = [];
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (map[y][x] !== '@') continue;
      let local_count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          if (map?.[y + dy]?.[x + dx] === '@') local_count++;
        }
      }
      if (local_count < 4) {
        count++;
        to_remove.push([y, x]);
      }
    }
  }
  for (let i = 0; i < to_remove.length; i++) {
    const [y, x] = to_remove[i];
    map[y][x] = '.';
  }
} while (to_remove.length)

console.log({ count });

console.log(JSON.stringify(summary(start)));