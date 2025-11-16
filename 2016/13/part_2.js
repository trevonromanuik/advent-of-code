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

const [N, TX, TY] = input.split(',').map(n => parseInt(n));

const map = {};
function getPos(x, y) {
  const k = [x, y].join(',');
  if (!map.hasOwnProperty(k)) {
    const n = x*x + 3*x + 2*x*y + y + y*y + N;
    const b = n.toString(2);
    let c = 0;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === '1') c++;
    }
    map[k] = (c % 2 === 0) ? '.' : '#';
  }
  return map[k];
}

const DIRS = [
  [0, -1], // up
  [0, +1], // down
  [-1, 0], // left
  [+1, 0], // right
]

function createKey(state) {
  return state.join(',');
}

const start_state = [1, 1];
const start_key = createKey(start_state);
const nodes = {
  [start_key]: {
    state: start_state,
    cost: 0,
  }
};

const q = [start_key];
let done = false;
while (q.length) {

  if (done) break;

  const key = q.shift();
  const node = nodes[key];
  const { state, cost } = node;

  const [x, y] = state;

  for (let i = 0; i < DIRS.length; i++) {

    if (done) break;

    const [dx, dy] = DIRS[i];
    const ny = y + dy;
    if (ny < 0) continue;
    const nx = x + dx;
    if (nx < 0) continue;

    if (getPos(nx, ny) === '.') {

      const new_state = [nx, ny];
      const new_key = createKey(new_state);
      const new_cost = cost + 1;

      const old_node = nodes[new_key];
      if (old_node) {
        if (new_cost < old_node.cost) {
          console.log(`found cheaper path to ${new_key}`);
        }
      } else {
        nodes[new_key] = {
          state: new_state,
          cost: new_cost,
        };
        if (new_cost < 50) {
          q.push(new_key);
        }
      }
    }
  }
}

console.log({ count: Object.keys(nodes).length });

console.log(`${hrTime() - start}µs`);