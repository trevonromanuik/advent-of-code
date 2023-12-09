const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

const sections = input.split('\n\n');
const moves = sections[0];
const mappings = sections[1].split('\n').reduce((acc, line) => {
    const split = line.split(' = ');
    const [l, r] = split[1].split(', ');
    acc[split[0]] = [l.substring(1), r.substring(0, 3)];
    return acc;
}, {});

let steps = 0;
let cur = 'AAA';
while (cur !== 'ZZZ') {
    cur = mappings[cur][moves[steps % moves.length] === 'L' ? 0 : 1];
    steps++;
}
console.log(steps);

console.log(`${Date.now() - start}ms`);