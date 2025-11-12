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

const count = input.replaceAll('\r', '').split('\n').reduce((count, line) => {
  let inside = false;
  let valid = false;
  for (let i = 0; i < line.length - 3; i++) {
    if (line[i] === '[') {
      inside = true;
      continue;
    }
    if (line[i] === ']') {
      inside = false;
      continue;
    }
    if (
      line[i + 1] === line[i + 2]
      && line[i] === line[i + 3]
      && line[i] !== line[i + 1]
    ) {
      if (inside) {
        valid = false;
        break;
      } else {
        valid = true;
      }
    }
  }
  if (test) console.log(line, valid);
  if (valid) count++;
  return count;
}, 0);

console.log({ count });

console.log(`${hrTime() - start}µs`);