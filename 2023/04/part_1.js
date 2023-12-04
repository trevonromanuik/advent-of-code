const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const sum = input.split('\n').reduce((sum, line, i) => {
    const split = line.split(' | ');
    const ns = new Set(split[1].split(/\s+/));
    if (debug) console.log(`${i + 1}: ${JSON.stringify(Array.from(ns))}`);
    const wins = split[0].substring(8).split(/\s+/).reduce((wins, n) => {
        if (ns.has(n)) wins++;
        return wins;
    }, 0);
    if (debug) console.log(`Card ${i + 1}: ${wins}`);
    if (wins > 0) sum += Math.pow(2, wins - 1);
    return sum;
}, 0);
console.log(sum);