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

const lines = input.replaceAll('\r', '').split('\n');
for (let i = 0; i < lines.length; i++) {
  let [, l, id,] = /([\w-]+)-(\d+)\[(\w+)]/.exec(lines[i]);
  id = parseInt(id);
  const name = l.split('').map((c) => {
    if (c === '-') return c;
    return String.fromCharCode(((c.charCodeAt(0) - 97 + id) % 26) + 97);
  }).join('');
  if (name.includes('northpole')) {
    console.log(name, l, id);
    break;
  }
}

console.log(`${hrTime() - start}µs`);