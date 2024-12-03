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

const sum = [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)].reduce((sum, [, l, r]) => {
    return sum + (parseInt(l) * parseInt(r));
}, 0);
console.log({ sum });

console.log(`${hrTime() - start}µs`);