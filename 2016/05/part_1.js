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

const crypto = require('crypto');
let key = '';
for (let i = 0; key.length < 8; i++) {
  const md5 = crypto.createHash('md5').update(`${input}${i}`).digest('hex');
  if (md5.startsWith('00000')) key += md5[5];
}

console.log({ key });

console.log(`${hrTime() - start}µs`);