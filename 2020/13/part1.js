const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const lines = input.split('\r\n');
const start_t = parseInt(lines[0]);
const buses = lines[1].split(',').map((n) => {
  return parseInt(n);
}).filter((n) => {
  return !isNaN(n);
});
console.log(start_t, buses);

let t = start_t;
while(true) {
  buses.forEach((n) => {
    if(t % n === 0) {
      console.log(t, n, t - start_t, (t - start_t) * n);
      process.exit(0);
    }
  });
  t++;
}