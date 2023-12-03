const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const rounds = 30000000;
const init = input.split(',').map((c) => {
    return parseInt(c);
});
const last_seen = new Array(rounds);
let prev = null;
let start = Date.now();
for (let i = 0; i < rounds; i++) {
    if (debug && i % 100000 === 0) {
        console.log(`${i} / ${rounds}`, Date.now() - start);
        start = Date.now();
    }
    let v;
    if (i < init.length) {
        v = init[i];
    } else if (last_seen[prev][0] === -1) {
        v = 0;
    } else {
        v = last_seen[prev][1] - last_seen[prev][0];
    }
    if (debug) console.log(`${i + 1}: ${v}`);
    prev = v;
    if (!last_seen[prev]) {
        last_seen[prev] = [-1, i];
    } else {
        last_seen[prev][0] = last_seen[prev][1];
        last_seen[prev][1] = i;
    }
}
console.log(prev);