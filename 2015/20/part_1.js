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

const target = parseInt(input);

function countPresents(house_number) {
  let count = 0;
  for (let i = 1; i <= house_number; i++) {
    if (house_number % i === 0) count += (i * 10);
  }
  return count;
}

const START_HOUSE_NUMBER = 800000;
const HOUSES_COUNT = 1000000;
for (let house_number = START_HOUSE_NUMBER; house_number < START_HOUSE_NUMBER + HOUSES_COUNT; house_number++) {
  const count = countPresents(house_number);
  if (count >= target) {
    console.log(`house ${house_number} got ${count} presents`);
    break;
  }
}

console.log(`${hrTime() - start}µs`);