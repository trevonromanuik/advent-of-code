const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const rounds = 2020;
const init = input.split(',');
const map = {};
let prev = null;
for (let i = 0; i < rounds; i++) {
    let v;
    if (i < init.length) {
        v = init[i];
    } else if (map[prev].length === 1) {
        v = '0';
    } else {
        const l = map[prev].length;
        v = map[prev][l - 1] - map[prev][l - 2];
    }
    if (debug) console.log(`${i + 1}: ${v}`);
    prev = v;
    if (!map[prev]) map[prev] = [];
    map[prev].push(i);
}