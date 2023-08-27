const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const n = input.split('\r\n\r\n').reduce((n, lines) => {
  const s = lines.split('\r\n').reduce((s, line) => {
    return line.split('').reduce((s, c) => {
      s.add(c);
      return s;
    }, s);
  }, new Set());
  console.log(s.size);
  return n + s.size;
}, 0);
console.log(n);