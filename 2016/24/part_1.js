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

const DISTANCES = {};
const n_pos = {};
let max_n = 0;
const map = input.replaceAll('\r', '').split('\n').map((line, y) => {
  for (let x = 0; x < line.length; x++) {
    if (line[x] !== '.' && line[x] !== '#') {
      const n = parseInt(line[x]);
      n_pos[n] = [x, y];
      DISTANCES[n] = {};
      if (n > max_n) max_n = n;
    }
  }
  return line.split('');
});
const ns = Object.keys(n_pos);
const WIDTH = map[0].length;
const HEIGHT = map.length;

const DIRS = {
  U: [0, -1], // up
  D: [0, +1], // down
  L: [-1, 0], // left
  R: [+1, 0], // right
};
const DIR_KEYS = Object.keys(DIRS);

for (let ni = 0; ni < ns.length; ni++) {
  // BFS to find the shortest paths to each other number
  const to_find = new Set();
  for (let nj = ni + 1; nj < ns.length; nj++) {
    to_find.add(nj.toString());
  }
  const [sx, sy] = n_pos[ni];
  const q = [[sx, sy, 0]];
  const seen = new Set([`${sx},${sy}`]);
  while (q.length && to_find.size) {
    const [x, y, c] = q.shift();
    for (let i = 0; i < DIR_KEYS.length; i++) {

      if (!to_find.size) break;

      const dir = DIR_KEYS[i];
      const [dx, dy] = DIRS[dir];

      const nx = x + dx;
      if (nx < 0 || nx >= WIDTH) continue;
      const ny = y + dy;
      if (ny < 0 || ny >= HEIGHT) continue;

      const k = `${nx},${ny}`;
      if (seen.has(k)) continue;
      seen.add(k);

      const p = map[ny][nx];
      if (p === '#') continue;

      const nc = c + 1;
      if (p !== '.' && to_find.has(p)) {
        DISTANCES[ni][p] = nc;
        DISTANCES[p][ni] = nc;
        to_find.delete(p);
      }

      q.push([nx, ny, nc]);
    }
  }
}

const q = [[0, new Set([0]), 0]];
while (q.length) {
  q.sort((a, b) => {
    return a[2] < b[2] ? -1 : 1;
  });
  const [n, seen, cost] = q.shift();
  if (seen.size === ns.length) {
    console.log({ cost });
    break;
  }
  for (let i = 0; i < ns.length; i++) {
    if (seen.has(i)) continue;
    const new_seen = new Set([...seen, i]);
    const new_cost = cost + DISTANCES[n][i];
    q.push([i, new_seen, new_cost]);
  }
}

console.log(JSON.stringify(summary(start)));