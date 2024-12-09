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

const digits = input.replaceAll('\r', '').split('').map((n) => {
    return parseInt(n);
});

let id = -1;
const memory = [];
digits.forEach((d, i) => {
    const v = i % 2 === 0 ? ++id : '.';
    for (let j = 0; j < d; j++) {
        memory.push(v);
    }
});
if (debug) console.log(memory);

let index = memory.indexOf('.');
while (index >= 0) {
    let v = memory.pop();
    while (v === '.' && index < memory.length) v = memory.pop();
    if (index < memory.length) memory[index] = v;
    index = memory.indexOf('.', index + 1);
}
if (debug) console.log(memory);

const sum = memory.reduce((sum, n, i) => {
    return sum + (n * i);
}, 0);

console.log({ sum });
console.log(`${hrTime() - start}µs`);