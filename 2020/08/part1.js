const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const ops = input.split('\r\n').map((line) => {
  const [op, n] = line.split(' ');
  return { op, n: parseInt(n) };
});

let i = 0;
let acc = 0;
const seen = new Set();
while(!seen.has(i)) {
  console.log(i, ops[i]);
  seen.add(i);
  switch(ops[i].op) {
    case 'acc':
      acc += ops[i].n;
      i++;
      break;
    case 'jmp':
      i += ops[i].n;
      break;
    case 'nop':
      i++;
      break;
  }
}
console.log(acc);