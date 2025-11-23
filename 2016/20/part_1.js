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

const MIN_VALUE = 0;
const MAX_VALUE = test ? 9 : 4294967295;

const ranges = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split('-').map(n => parseInt(n));
});
ranges.sort((a, b) => {
  return a[0] === b[0] ?
    a[1] < b[1] ? -1 : 1 :
    a[0] < b[0] ? -1 : 1;
});

for (let i = 0; i < ranges.length - 1; i++) {
  if (ranges[i + 1][0] > ranges[i][1] + 1) {
    console.log({ n: ranges[i][1] + 1 });
    break;
  }
}

console.log(`${hrTime() - start}µs`);