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

console.log(`${hrTime() - start}µs`);

const inputs = input.replaceAll('\r', '').split('\n').map(n => parseInt(n));
console.log(inputs);

let loops = null;
let subject_number = 7;
let value = 1;
let i = 0;
while(++i) {
    if (i % 1000 === 0) console.log(i);
    value *= subject_number;
    value %= 20201227;
    if (value === inputs[0]) {
        subject_number = inputs[1];
        loops = i;
        break;
    } else if (value === inputs[1]) {
        subject_number = inputs[0];
        loops = i;
        break;
    }
}
value = 1;
console.log({ loops, subject_number, value })
for (let i = 0; i < loops; i++) {
    value *= subject_number;
    value %= 20201227;
}
console.log(value);