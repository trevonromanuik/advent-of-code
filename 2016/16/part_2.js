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

const LENGTH = test ? 20 : 35651584;

let s = input.split('').map(n => parseInt(n));
while (s.length < LENGTH) {
  const t = new Array((s.length * 2) + 1).fill(null);
  t[s.length] = 0;
  for (let i = 0; i < s.length; i++) {
    t[i] = s[i];
    t[s.length + 1 + i] = s[s.length - 1 - i] ? 0 : 1;
  }
  s = t;
}

if (s.length > LENGTH) {
  s = s.slice(0, LENGTH);
}

while (s.length % 2 === 0) {
  const t = new Array(s.length / 2).fill(null);
  for (let i = 0; i < s.length; i += 2) {
    t[i / 2] = (s[i] === s[i + 1]) ? 1 : 0;
  }
  s = t;
}

console.log({ checksum: s.join('') });

console.log(`${hrTime() - start}µs`);