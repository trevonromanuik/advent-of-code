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
  let count = 0;
  if(p[min - 1] === c) count++;
  if(p[max - 1] === c) count++;
  if(count === 1) n++;
  return n;
}, 0);
console.log(n);