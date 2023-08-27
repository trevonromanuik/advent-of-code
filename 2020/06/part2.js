const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const n = input.split('\r\n\r\n').reduce((n, lines) => {
  lines = lines.split('\r\n');
  const counts = lines.reduce((counts, line) => {
    return line.split('').reduce((counts, c) => {
      if(!counts[c]) counts[c] = 1;
      else counts[c]++;
      return counts;
    }, counts);
  }, {});
  const count = Object.keys(counts).reduce((count, k) => {
    if(counts[k] === lines.length) count++;
    return count;
  }, 0);
  console.log(count);
  return n + count;
}, 0);
console.log(n);