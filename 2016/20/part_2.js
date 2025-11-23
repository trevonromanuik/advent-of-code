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

const MAX_VALUE = test ? 9 : 4294967295;

const ranges = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split('-').map(n => parseInt(n));
});
ranges.sort((a, b) => {
  return a[0] === b[0] ?
    a[1] < b[1] ? -1 : 1 :
    a[0] < b[0] ? -1 : 1;
});

const collapsed_ranges = [ranges[0]];
for (let i = 1; i < ranges.length; i++) {
  const prev_end = collapsed_ranges[collapsed_ranges.length - 1][1] + 1;
  const [next_start, next_end] = ranges[i];
  if (next_start <= prev_end) {
    if (next_end > prev_end) {
      collapsed_ranges[collapsed_ranges.length - 1][1] = next_end;
    }
  } else {
    collapsed_ranges.push(ranges[i]);
  }
}

let count = collapsed_ranges[0][0];
for (let i = 1; i < collapsed_ranges.length; i++) {
  const prev_end = collapsed_ranges[i - 1][1];
  const next_start = collapsed_ranges[i][0];
  count += next_start - prev_end - 1;
}
count += MAX_VALUE - collapsed_ranges[collapsed_ranges.length - 1][1];

console.log({ count });

console.log(`${hrTime() - start}µs`);