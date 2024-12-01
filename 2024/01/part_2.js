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

const lines = input.replaceAll('\r', '').split('\n');
const [l, r] = lines.reduce(([l, r], line, i) => {
    const split = line.split('   ');
    l[i] = parseInt(split[0]);
    if (!r.has(split[1])) r.set(split[1], 0);
    r.set(split[1], r.get(split[1]) + 1);
    return [l, r];
}, [new Array(lines.length), new Map()]);

const similarity = l.reduce((similarity, n) => {
    return similarity + (n * (r.get(n.toString()) || 0));
}, 0);

console.log({ similarity });
console.log(`${hrTime() - start}µs`);