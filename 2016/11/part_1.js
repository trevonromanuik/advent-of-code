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

const INPUT_STATE = input.replaceAll('\r', '').split('\n').reduce((state, line, floor) => {
  const s = line.substring(0, line.length - 1).split(' ');
  for (let i = 0; i < s.length; i++) {
    let c = s[i];
    if (c.endsWith('.') || c.endsWith(',')) c = c.substring(0, c.length - 1);
    if (c === "generator") {
      const el = s[i - 1];
      if (!state[el]) state[el] = new Array(2).fill(null);
      state[el][1] = floor;
    } else if (c === "microchip") {
      const el = s[i - 1].split('-')[0];
      if (!state[el]) state[el] = new Array(2).fill(null);
      state[el][0] = floor;
    }
  }
  return state;
}, {});

const ELEMENTS = Object.keys(INPUT_STATE);
ELEMENTS.sort();

console.log({ ELEMENTS });

function calculateDistance(state) {
  let d = 0;
  for (let i = 0; i < state.length; i++) {
    d += (3 - state[i]);
  }
  return d;
}

const start_state = [0];
for (let i = 0; i < ELEMENTS.length; i++) {
  start_state.push(INPUT_STATE[ELEMENTS[i]][0]);
  start_state.push(INPUT_STATE[ELEMENTS[i]][1]);
}
const start_key = start_state.join('|');

const valids = { [start_key]: true };
const nodes = {
  [start_key]: {
    v: start_state,
    c: 0,
    d: calculateDistance(start_state),
    prev: null,
    next: new Set(),
  },
};

let done = false;
const q = [start_key];
while (q.length) {

  if (done) break;

  q.sort((a, b) => {
    const { c: ac, d: ad } = nodes[a];
    const { c: bc, d: bd } = nodes[b];
    return (ac + ad) < (bc + bd) ? -1 : 1;
  });

  const key = q.shift();
  const node = nodes[key];
  const state = node.v;
  const floor = state[0];

  for (let i = -1; i <= 1; i += 2) {

    if (done) break;

    const new_floor = floor + i;
    if (new_floor < 0 || new_floor > 3) continue;

    for (let j = 1; j < state.length; j++) {

      if (done) break;

      if (state[j] === floor) {

        for (let k = j; k < state.length; k++) {

          if (done) break;

          if (state[k] === floor) {

            const new_state = [...state];
            new_state[0] = new_floor;
            new_state[j] = new_floor;
            new_state[k] = new_floor;
            const new_key = new_state.join('|');

            if (!valids.hasOwnProperty(new_key)) {
              const unprotected_counts = new Array(4).fill(0);
              const generator_counts = new Array(4).fill(0);
              for (let l = 1; l < state.length; l += 2) {
                if (new_state[l] !== new_state[l + 1]) unprotected_counts[new_state[l]]++;
                generator_counts[new_state[l + 1]]++;
              }

              let valid = true;
              for (let l = 0; l < 3; l++) {
                if (unprotected_counts[l] > 0 && generator_counts[l] > 0) {
                  valid = false;
                  break;
                }
              }

              valids[new_key] = valid;
            }

            if (!valids[new_key]) continue;

            const new_cost = node.c + 1;

            // check if this is our winning state
            done = true;
            for (let l = 0; l < new_state.length; l++) {
              if (new_state[l] !== 3) {
                done = false;
                break;
              }
            }

            if (done) {
              console.log({ k: new_key, c: new_cost });
              break;
            }

            const old_node = nodes[new_key];
            if (old_node) {
              if (new_cost < old_node.c) {
                // remove this node from the prev node's next set
                nodes[old_node.prev].next.delete(new_key);
                // set this node's prev to the new prev node
                old_node.prev = key;
                // update this node's cost
                old_node.c = new_cost;
                // recursively update the next costs for everything that follows
                const q2 = [...old_node.next];
                for (let l = 0; l < q2.length; l++) {
                  const n = nodes[q2[l]];
                  n.c = nodes[n.prev].c + 1;
                  n.next.forEach((k) => q2.push(k));
                }
              }
            } else {
              node.next.add(new_key);
              nodes[new_key] = {
                v: new_state,
                c: new_cost,
                d: calculateDistance(new_state),
                prev: key,
                next: new Set(),
              };
              q.push(new_key);
            }

          }
        }
      }
    }
  }
}

console.log(`${hrTime() - start}µs`);