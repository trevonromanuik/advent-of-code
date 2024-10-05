const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

input.replaceAll('\r', '').split('\n').forEach((line) => {
    let i = 0;
    while(true) {
        const hash = crypto.createHash('md5').update(`${line}${++i}`).digest('hex')
        if (hash.startsWith('000000')) break;
    }
    console.log(line, i);
});

console.log(`${hrTime() - start}µs`);