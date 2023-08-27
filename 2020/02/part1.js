const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const n = input.split('\r\n').reduce((n, line) => {
  let l, r, p, c;
  [l, p] = line.split(': ');
  [l, c] = l.split(' ');
  [l, r] = l.split('-');
  const min = parseInt(l);
  const max = parseInt(r);
  const count = p.split('').reduce((count, char) => {
    if(char === c) count++;
    return count;
  }, 0);
  if(count >= min && count <= max) n++;
  return n;
}, 0);
console.log(n);