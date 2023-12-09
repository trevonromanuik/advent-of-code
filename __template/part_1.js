const fs = require('fs');
const path = require('path');

const test = true;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return t[0] * 1000000 + t[1] / 1000;
}

const start = hrTime();

console.log(`${hrTime() - start}ms`);