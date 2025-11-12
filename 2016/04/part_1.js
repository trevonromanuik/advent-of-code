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

const sum = input.replaceAll('\r', '').split('\n').reduce((sum, line) => {
  const [, l, id, checksum] = /([\w-]+)-(\d+)\[(\w+)]/.exec(line);
  const counts = {};
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (c === '-') continue;
    if (!counts[c]) counts[c] = 0;
    counts[c]++;
  }
  // console.log({ counts });
  const v = Object.keys(counts).sort((a, b) => {
    return counts[a] === counts[b] ?
      a < b ? -1 : 1 :
      counts[a] > counts[b] ? -1 : 1;
  }).slice(0, 5).join('');
  if (v === checksum) {
    // console.log(`real`, line, v);
    sum += parseInt(id);
  } else {
    // console.log(`fake`, line, v);
  }
  return sum;
}, 0);

console.log({ sum });

console.log(`${hrTime() - start}µs`);