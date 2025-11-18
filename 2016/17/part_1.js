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

const crypto = require('crypto');

const DIRS = {
  U: [0, -1], // up
  D: [0, +1], // down
  L: [-1, 0], // left
  R: [+1, 0], // right
};

const DIR_KEYS = Object.keys(DIRS);

const TX = 3;
const TY = 3;

const OPEN_KEYS = new Set(['b', 'c', 'd', 'e', 'f']);

function createKey(state) {
  return state.join(',');
}

const start_state = [0, 0, ''];
const start_key = createKey(start_state);
const nodes = {
  [start_key]: {
    state: start_state,
    cost: 0,
  },
};

const q = [start_key];
let done = false;
while (q.length) {

  if (done) break;

  const key = q.shift();
  const node = nodes[key];
  const { state, cost } = node;

  const [x, y, p] = state;
  const hash = crypto.createHash('md5').update(`${input}${p}`).digest('hex');
  for (let i = 0; i < DIR_KEYS.length; i++) {

    if (done) break;

    if (!OPEN_KEYS.has(hash[i])) continue;

    const dir = DIR_KEYS[i];
    const [dx, dy] = DIRS[dir];

    const nx = x + dx;
    if (nx < 0 || nx > 3) continue;
    const ny = y + dy;
    if (ny < 0 || ny > 3) continue;

    const new_state = [nx, ny, p + dir];
    const new_key = createKey(new_state);
    const new_cost = cost + 1;

    if (nx === TX && ny === TY) {
      console.log(new_state);
      done = true;
    }

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
      q.push(new_key);
    }
  }

}

console.log(`${hrTime() - start}µs`);