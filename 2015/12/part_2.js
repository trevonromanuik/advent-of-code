const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const ROOT = JSON.parse(input);

function getCount(o) {
  if (typeof(o) === "number") {
    return o;
  }
  if (typeof(o) === "string") {
    return 0;
  }
  if (Array.isArray(o)) {
    return o.reduce((sum, o) => {
      return sum + getCount(o);
    }, 0);
  }
  const keys = Object.keys(o);
  if (keys.some((key) => {
    return o[key] === "red";
  })) {
    return 0;
  }
  return keys.reduce((sum, k) => {
    return sum + getCount(o[k]);
  }, 0);
}

const sum = getCount(ROOT);
console.log({ sum });

console.log(`${hrTime() - start}µs`);