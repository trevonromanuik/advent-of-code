const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const lines = input.split('\n');
const buses = lines[1].split(',').map((n, i) => {
  n = parseInt(n);
  return { n, i };
}).filter(({ n }) => {
  return !isNaN(n);
});

const gcd = (a, b) => b === 0 ? a : gcd (b, a % b);
const lcm = (a, b) =>  a / gcd (a, b) * b;

let t = buses[0].n;
let p = buses[0].n;
for(let { n, i } of buses) {
  while((t + i) % n !== 0) t += p;
  p = lcm(p, n);
  console.log({ p });
}
console.log('-----');
console.log(t);