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

const sum = input.split('\n').reduce((sum, line) => {
    let arrays = [line.split(' ').map(n => parseInt(n))];
    let a = arrays[0];
    while (a.some(n => n !== 0)) {
        const new_a = new Array(a.length - 1);
        for (let i = 1; i < a.length; i++) {
            new_a[i - 1] = a[i] - a[i - 1];
        }
        arrays.push(new_a);
        a = new_a;
    }
    if (debug) console.log(arrays);
    let new_value = 0;
    for (let i = arrays.length - 2; i >= 0; i--) {
        new_value = arrays[i][arrays[i].length - 1] + new_value;
    }
    if (debug) console.log(new_value);
    return sum + new_value;
}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);