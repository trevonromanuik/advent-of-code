const fs = require('fs');
const path = require('path');

const debug = false;
const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');
const numbers = input.split('\n').map((line) => {
  return parseInt(line) * 811589153;
});
if(debug) console.log(`Initial arrangement`);
if(debug) console.log(numbers.join(', '));
if(debug) console.log('');

const nodes = numbers.map((n) => {
  return { n };
});
let head = nodes[0];
let zero_node = null;
nodes.forEach((node, i) => {
  const li = i === 0 ? numbers.length - 1 : i - 1;
  node.l = nodes[li];
  const ri = i === numbers.length - 1 ? 0 : i + 1;
  node.r = nodes[ri];
  if(node.n === 0) zero_node = node;
});

for(let i = 0; i < 10; i++) {
  numbers.forEach((n, i) => {
    const node = nodes[i];
    let cur_node = node;
    if(n === 0) {
      if(debug) console.log(`0 does not move`);
    } else {
      const d = n % (numbers.length - 1);
      if(d === 0) {
        if(debug) console.log(`${n} does not move`);
      } else {
        for(let i = 0; i < Math.abs(d); i++) {
          cur_node = d > 0 ? cur_node.r : cur_node.l;
        }
        if(debug) {
          if(d > 0) {
            console.log(`${n} moves ${d} between ${cur_node.n} and ${cur_node.r.n}`);
          } else {
            console.log(`${n} moves ${d} between ${cur_node.l.n} and ${cur_node.n}`);
          }
        }
        // remove node
        node.l.r = node.r;
        node.r.l = node.l;
        if(node === head) {
          head = node.r;
        }
        // move node
        if(d > 0) {
          node.l = cur_node;
          node.r = cur_node.r;
        } else {
          node.l = cur_node.l;
          node.r = cur_node;
        }
        node.l.r = node;
        node.r.l = node;
      }
    }
  });
  if(debug) {
    const ns = [head.n]; 
    cur_node = head.r;
    while(cur_node !== head) {
      ns.push(cur_node.n);
      cur_node = cur_node.r;
    }
    console.log(`after round ${i + 1}`);
    console.log(ns.join(', '));
    console.log('');
  }
}

const sum = [1000, 2000, 3000].reduce((sum, n) => {
  n = n % numbers.length;
  let cur_node = zero_node;
  for(let i = 0; i < n; i++) {
    cur_node = cur_node.r;
  }
  if(debug) console.log(sum, cur_node.n);
  return sum + cur_node.n;
}, 0);
console.log(sum);