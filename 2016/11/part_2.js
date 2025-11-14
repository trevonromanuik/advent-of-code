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

const counts_per_floor = new Array(4).fill(0);
input.replaceAll('\r', '').split('\n').forEach((line, floor) => {
  const s = line.substring(0, line.length - 1).split(' ');
  for (let i = 0; i < s.length; i++) {
    let c = s[i];
    if (c.endsWith('.') || c.endsWith(',')) c = c.substring(0, c.length - 1);
    if (c === "generator") {
      counts_per_floor[floor]++;
    } else if (c === "microchip") {
      counts_per_floor[floor]++;
    }
  }
}, {});

// add 4 more things to the first floor
counts_per_floor[0] += 4;

console.log({ counts_per_floor });

let steps = 0;
for (let i = 0; i < 3; i++) {
  while (counts_per_floor[i] > 0) {
    // move up to two things up
    const n = Math.min(counts_per_floor[i], 2);
    counts_per_floor[i] -= n;
    counts_per_floor[i + 1] += n;
    steps++;
    if (counts_per_floor[i] > 0) {
      // move one thing back down
      counts_per_floor[i + 1] -= 1;
      counts_per_floor[i] += 1;
      steps++;
    }
  }
}

console.log({ steps });

console.log(`${hrTime() - start}µs`);