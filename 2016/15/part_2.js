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

const r = /^Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)\.$/;
const discs = input.replaceAll('\r', '').split('\n').map((line) => {
  const [, id, npos, spos] = r.exec(line);
  return [id, npos, spos].map((n) => parseInt(n));
});
discs.push([discs.length + 1, 11, 0]);

console.log(discs);

for (let i = 0; i < Infinity; i++) {
  let done = true;
  for (let j = 0; j < discs.length; j++) {
    const [id, npos, spos] = discs[j];
    if ((spos + id + i) % npos !== 0) {
      done = false;
      break;
    }
  }
  if (done) {
    console.log({ i });
    break;
  }
}

console.log(`${hrTime() - start}µs`);