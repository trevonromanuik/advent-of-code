const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const ns = input.split('\r\n').map((line) => {
  return parseInt(line);
}).sort((a, b) => (a - b));

const counts = new Array(4).fill(0);
ns.unshift(0);
ns.push(ns[ns.length - 1] + 3);
for(let i = 1; i < ns.length; i++) {
  counts[ns[i] - ns[i - 1]]++;
}
console.log(counts);
console.log(counts[1] * counts[3]);