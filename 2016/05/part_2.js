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
let key = new Array(8).fill(null);
for (let i = 0; key.some(n => n === null); i++) {
  const md5 = crypto.createHash('md5').update(`${input}${i}`).digest('hex');
  if (!md5.startsWith('00000')) continue;
  const pos = parseInt(md5[5]);
  if (isNaN(pos) || pos < 0 || pos > 7) continue;
  if (key[pos] !== null) continue;
  key[pos] = md5[6];
}

console.log({ key: key.join('') });

console.log(`${hrTime() - start}µs`);