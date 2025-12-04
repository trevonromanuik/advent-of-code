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
const nodes = lines.reduce((nodes, line) => {
  const [, x, y, s, u, a] = r.exec(line);
  nodes[`${x},${y}`] = {
    x: parseInt(x),
    y: parseInt(y),
    s: parseInt(s),
    u: parseInt(u),
    a: parseInt(a),
  };
  return nodes;
}, {});

const keys = Object.keys(nodes);

let count = 0;
for (let i = 0; i < keys.length; i++) {
  const a = nodes[keys[i]];
  for (let j = 0; j < keys.length; j++) {
    if (i === j) continue;
    const b = nodes[keys[j]];
    if (a.u > 0 && a.u <= b.a) count++;
  }
}

console.log({ count });

console.log(`${hrTime() - start}µs`);