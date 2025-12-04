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

const lines = input.replaceAll('\r', '').split('\n');
lines.shift();
lines.shift();

const r = /^\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%$/
let empty_node;
let WIDTH = 0;
let HEIGHT = 0;
const nodes = lines.reduce((nodes, line) => {
  const [, x, y, s, u, a] = r.exec(line);
  const node = {
    x: parseInt(x),
    y: parseInt(y),
    s: parseInt(s),
    u: parseInt(u),
    a: parseInt(a),
  };
  nodes[`${node.x},${node.y}`] = node;
  if (node.u === 0) empty_node = [node.x, node.y];
  if (node.x > WIDTH) WIDTH = node.x;
  if (node.y > HEIGHT) HEIGHT = node.y;
  return nodes;
}, {});
WIDTH += 1;
HEIGHT += 1;

const MAX_SIZE = test ? 30 : 100;

const DIRS = {
  U: [0, -1], // up
  D: [0, +1], // down
  L: [-1, 0], // left
  R: [+1, 0], // right
};
const DIR_KEYS = Object.keys(DIRS);

function createKey(value) {
  return value.join(',');
}

function getDistance([ex, ey, gx, gy]) {
  return Math.abs(gx - ex) + Math.abs(gy - ey) + gx + gy;
}

const start_value = [...empty_node, WIDTH - 1, 0];
const start_key = createKey(start_value);
const states = {
  [start_key]: {
    value: start_value,
    cost: 0,
    dist: getDistance(start_value),
    prev: null,
    next: new Set(),
  },
};

const q = [start_key];
let done = false;
while (q.length) {

  if (done) break;

  q.sort((a, b) => {
    const { cost: ac, dist: ad } = states[a];
    const { cost: bc, dist: bd } = states[b];
    return (ac + ad) < (bc + bd) ? -1 : 1;
  });

  const key = q.shift();
  const state = states[key];
  const { value, cost } = state;
  const [ex, ey, gx, gy] = value;

  for (let i = 0; i < DIR_KEYS.length; i++) {

    if (done) break;

    const dir = DIR_KEYS[i];
    const [dx, dy] = DIRS[dir];

    const nex = ex + dx;
    if (nex < 0 || nex >= WIDTH) continue;
    const ney = ey + dy;
    if (ney < 0 || ney >= HEIGHT) continue;

    if (nodes[`${nex},${ney}`].s >= MAX_SIZE) continue;

    let ngx = gx;
    let ngy = gy;
    if (nex === gx && ney === gy) {
      ngx = ex;
      ngy = ey;
    }

    const new_value = [nex, ney, ngx, ngy];
    const new_key = createKey(new_value);
    const new_cost = cost + 1;

    if (ngx === 0 && ngy === 0) {
      // we won!
      console.log({ steps: new_cost });
      done = true;
      break;
    }

    const old_state = states[new_key];
    if (old_state) {
      if (new_cost < old_state.cost) {
        // remove this state from the prev state's next set
        states[old_state.prev].next.delete(new_key);
        // set this state's prev to the new prev state
        old_state.prev = key;
        // update this state's cost
        old_state.cost = new_cost;
        // recursively update the costs for everything that follows
        const q = [...old_state.next];
        for (let i = 0; i < q.length; i++) {
          const state = states[q[i]];
          state.cost = states[state.prev].cost + 1;
          state.next.forEach((key) => q.push(key));
        }
      }
    } else {
      state.next.add(new_key);
      states[new_key] = {
        value: new_value,
        cost: new_cost,
        dist: getDistance(new_value),
        prev: key,
        next: new Set(),
      };
      q.push(new_key);
    }
  }
}

console.log(`${hrTime() - start}µs`);