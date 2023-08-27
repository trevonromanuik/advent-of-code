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

function run(i, acc, path) {
  const seen = new Set();
  path.forEach(({ i }) => {
    seen.add(i);
  });
  while(!seen.has(i) && i < ops.length) {
    console.log(i, ops[i]);
    seen.add(i);
    path.push({ i, acc });
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
  return { i, acc, path };
}

const { i, acc, path: p } = run(0, 0, []);
console.log(i, acc);
for(let j = p.length - 1; j >= 0; j--) {
  let { i, acc } = p[j];
  if(ops[i].op === 'nop') {
    const r = run(i + ops[i].n, acc, p.slice(0, j));
    i = r.i;
    acc = r.acc;
  } else if(ops[i].op === 'jmp') {
    const r = run(i + 1, acc, p.slice(0, j));
    i = r.i;
    acc = r.acc;
  } else {
    continue;
  }
  if(i >= ops.length) {
    console.log(i, acc);
    break;
  }
}