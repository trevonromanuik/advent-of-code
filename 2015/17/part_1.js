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

const LITERS = test ? 25 : 150;
const buckets = input.replaceAll('\r', '').split('\n').map((line) => {
  return parseInt(line);
}).sort((a, b) => {
  return a < b ? 1 : -1;
});

let count = 0;
const q = buckets.map((n, i) => {
  return [n, i, [n]];
});
while (q.length) {
  const [n, i, p] = q.pop();
  for (let j = i + 1; j < buckets.length; j++) {
    const new_n = n + buckets[j];
    if (new_n === LITERS) {
      console.log([...p, buckets[j]]);
      count++;
    } else if (new_n < LITERS) {
      q.push([new_n, j, [...p, buckets[j]]]);
    }
  }
}
console.log({ count });

console.log(`${hrTime() - start}µs`);