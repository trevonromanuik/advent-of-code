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

const R = new RegExp(/(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\./i)
const pairs = input.replaceAll('\r', '').split('\n').reduce((pairs, line) => {
  const r = R.exec(line);
  const [_s, u, op, n, o] = r;
  if (!pairs[u]) pairs[u] = {};
  pairs[u][o] = parseInt(n) * (op === 'lose' ? -1 : 1);
  return pairs;
}, {});

const names = Object.keys(pairs);
pairs["Me"] = {};
names.forEach((name) => {
  pairs["Me"][name] = 0;
  pairs[name]["Me"] = 0;
});
names.push("Me");

let max_path, max_cost = -Infinity;
const costs = names.reduce((costs, name) => {
  costs[name] = 0;
  return costs;
}, {});
const q = names.map((name) => {
  return [name, 1];
});
while (q.length) {
  const [path, n] = q.pop();
  names.forEach((name) => {
    if (!!~path.indexOf(name)) return;
    const last_name = path.substring(path.lastIndexOf(',') + 1);
    const new_path = `${path},${name}`;
    let new_cost = costs[path] + pairs[last_name][name] + pairs[name][last_name];
    costs[new_path] = new_cost;
    const new_n = n + 1;
    if (new_n === names.length) {
      const first_name = path.substring(0, path.indexOf(','));
      new_cost += pairs[name][first_name] + pairs[first_name][name];
      if (new_cost > max_cost) {
        max_cost = new_cost;
        max_path = new_path;
      }
    }
    q.push([new_path, new_n]);
  });
}
console.log({ max_cost, max_path });

console.log(`${hrTime() - start}µs`);