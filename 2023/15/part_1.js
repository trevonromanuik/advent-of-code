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

const sum = input.split(',').reduce((sum, line) => {
    let n = 0;
    for (let i = 0; i < line.length; i++) {
        n += line.charCodeAt(i);
        n *= 17;
        n %= 256;
    }
    if (debug) console.log(line, n);
    return sum + n;
}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);