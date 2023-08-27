const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function bsplit(a) {
  if(a.length === 2) return a;
  return [
    bsplit(a.slice(0, a.length / 2)),
    bsplit(a.slice(a.length / 2)),
  ];
}

function btree(d) {
  const n = Math.pow(2, d);
  const a = new Array(n);
  for(let i = 0; i < n; i++) {
    a[i] = i;
  }
  return bsplit(a);
}

let max = 0;
const rtree = btree(7);
const ctree = btree(3);
input.split('\r\n').forEach((line) => {
  let r = rtree;
  for(let i = 0; i < 7; i++) {
    r = r[line[i] === 'F' ? 0 : 1];
  }
  let c = ctree;
  for(let i = 7; i < 10; i++) {
    c = c[line[i] === 'L' ? 0 : 1];
  }
  const s = r * 8 + c;
  console.log({ line, r, c, s });
  if(s > max) max = s;
});
console.log(max);