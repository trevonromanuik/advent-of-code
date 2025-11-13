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

function countLength(s) {
  let length = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      let j = i + 1;
      for (j; j < s.length; j++) {
        if (s[j] === ')') {
          const [n, r] = s.substring(i + 1, j).split('x').map(n => parseInt(n));
          length += (n * r);
          i = j + n;
          break;
        }
      }
    } else {
      length += 1;
    }
  }
  return length;
}

const length = countLength(input);

console.log({ length });

console.log(`${hrTime() - start}µs`);