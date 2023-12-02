const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const num_map = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
].reduce((acc, s, i) => {
  acc[s] = i;
  acc[i] = i;
  return acc;
}, {});
const num_keys = Object.keys(num_map);

function isNum(line, i) {
  for (let j = 0; j < num_keys.length; j++) {
    const key = num_keys[j];
    if (i + key.length > line.length) continue;
    for (let k = 0; k < key.length; k++) {
      if (line[i + k] !== key[k]) break;
      if (k === key.length - 1) return key;
    }
  }
}

const sum = input.split('\n').reduce((sum, line) => {

  if (!line) return sum;

  let first = null;
  for (let i = 0; i < line.length; i++) {
    first = isNum(line, i);
    if (first) break;
  }

  let last = null;
  for (let i = line.length - 1; i >= 0; i--) {
    last = isNum(line, i);
    if (last) break;
  }

  const n = (num_map[first] * 10) + num_map[last];
  if (debug) console.log(first, last, n);
  return sum + n;

}, 0);

console.log(sum);