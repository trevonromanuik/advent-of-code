const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const bags = {};
input.split('\r\n').forEach((line) => {
  let i = line.indexOf(' ');
  i = line.indexOf(' ', i + 1);
  const k = line.substring(0, i);
  if(!bags[k]) bags[k] = { key: k, children: {}, parents: {} };
  [...line.matchAll(/(\d+)\s(\w+\s\w+)\sbags?/g)].forEach(([, n, ck]) => {
    n = parseInt(n);
    if(!bags[ck]) bags[ck] = { key: ck, children: {}, parents: {} };
    bags[k].children[ck] = n;
    bags[ck].parents[k] = true;
  });
}, {});

const q = ['shiny gold'];
const seen = new Set();
while(q.length) {
  const k = q.pop();
  seen.add(k);
  Object.keys(bags[k].parents).forEach((k) => {
    if(!seen.has(k)) q.push(k);
  });
}
console.log(seen.size - 1);