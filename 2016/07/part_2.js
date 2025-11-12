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
  const insides = [];
  const outsides = [];
  for (let i = 0; i < line.length - 2; i++) {
    if (line[i] === '[') {
      inside = true;
      continue;
    }
    if (line[i] === ']') {
      inside = false;
      continue;
    }
    if (
      line[i] === line[i + 2]
      && line[i] !== line[i + 1]
      && line[i + 1] !== '['
      && line[i + 1] !== ']'
    ) {
      if (inside) {
        insides.push(line.substring(i, i + 3));
      } else {
        outsides.push(line.substring(i, i + 3));
      }
    }
  }
  let valid = false;
  for (let i = 0; i < outsides.length; i++) {
    if (valid) break;
    for (let j = 0; j < insides.length; j++) {
      if (valid) break;
      if (
        outsides[i][0] === insides[j][1]
        && outsides[i][1] === insides[j][0]
      ) {
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