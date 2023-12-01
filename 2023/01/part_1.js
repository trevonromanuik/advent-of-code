const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const sum = input.split('\n').reduce((sum, line) => {

  if (!line) return sum;

  let first = null;
  for (let i = 0; i < line.length; i++) {
    const c = line.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      first = line[i];
      break;
    }
  }

  let last = null;
  for (let i = line.length - 1; i >= 0; i--) {
    const c = line.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      last = line[i];
      break;
    }
  }

  const n = parseInt(first + last);
  if (debug) console.log(first, last, n);
  return sum + n;

}, 0);

console.log(sum);