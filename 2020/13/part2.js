const fs = require('fs');
const path = require('path');

const test = true;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const lines = input.split('\r\n');
const buses = lines[1].split(',').map((n, b) => {
  n = parseInt(n);
  return { n, b };
}).filter(({ n }) => {
  return !isNaN(n);
});

const N = buses.reduce((p, { n }) => {
  return p * n;
}, 1);

const x = buses.reduce((sum, bus) => {
  const { n, b } = bus;
  const Ni = N / n;
  let xi = 1;
  while(true) {
    if((Ni * xi) % n === 1) break;
    xi++;
  }
  return sum + (b * Ni * xi);
}, 0);

let t = x;
while(true) {
  console.log(t);
  if(buses.every(({ n, i }) => {
    return t % n === i;
  })) {
    console.log(t);
    break;
  }
  t += N;
}

/**
 * 
 * 67,7,x,59,61
 * t = 0 (mod 67)
 * t = 1 (mod 7)
 * t = 3 (mod 59)
 * t = 4 (mod 61)
 * 
 */