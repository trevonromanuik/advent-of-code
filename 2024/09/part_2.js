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
if (debug) console.log(memory.join(''));

let num_end, num_start = memory.length;
while ((num_end = findLastIndexFrom(memory, (n) => n !== '.', num_start - 1)) > -1) {
    const num = memory[num_end];
    id = num;
    num_start = findLastIndexFrom(memory, (n) => n !== num, num_end) + 1;
    if (num > id) continue;
    const num_length = num_end - num_start;
    let free_start, free_end = -1;
    while ((free_start = findIndexFrom(memory, (n) => n === '.', free_end + 1)) > -1 && free_start < num_start) {
        free_end = findIndexFrom(memory, (n) => n !== '.', free_start) - 1;
        const free_length = free_end - free_start;
        if (free_length >= num_length) {
            free_end = free_start + num_length;
            for (let i = free_start; i <= free_end; i++) {
                memory[i] = num;
            }
            for (let i = num_start; i <= num_end; i++) {
                memory[i] = '.';
            }
            break;
        }
    }
    if (debug) console.log(memory.join(''));
}

const sum = memory.reduce((sum, n, i) => {
    if (n !== '.') sum += (n * i);
    return sum;
}, 0);

console.log({ sum });
console.log(`${hrTime() - start}µs`);


function findIndexFrom(array, fn, from) {
    if (from === undefined) from = 0;
    for (let i = from; i <= array.length; i++) {
        if (fn(array[i], i)) return i;
    }
    return -1;
}

function findLastIndexFrom(array, fn, from) {
    if (from === undefined) from = array.length - 1;
    for (let i = from; i >= 0; i--) {
        if (fn(array[i], i)) return i;
    }
    return -1;
}