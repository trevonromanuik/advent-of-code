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

const counts = {};
const keys = new Set(Object.keys(bags));
while(keys.size) {
  keys.forEach((k) => {
    const b = bags[k];
    const cks = Object.keys(b.children);
    let count = 1;
    for(let i = 0; i < cks.length; i++) {
      const ck = cks[i];
      if(!counts[ck]) return;
      count += counts[ck] * b.children[ck];
    }
    counts[k] = count;
    keys.delete(k);
  });
}
console.log(counts['shiny gold'] - 1);