const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const card_counts = {};
const sum = input.split('\n').reduce((sum, line, i) => {
    const card_index = i + 1;
    if (!card_counts[card_index]) {
        card_counts[card_index] = 1;
    } else {
        card_counts[card_index]++;
    }
    const split = line.split(' | ');
    const ns = new Set(split[1].split(/\s+/));
    if (debug) console.log(`${i + 1}: ${JSON.stringify(Array.from(ns))}`);
    const wins = split[0].substring(8).split(/\s+/).reduce((wins, n) => {
        if (ns.has(n)) wins++;
        return wins;
    }, 0);
    if (debug) console.log(`Card ${i + 1}: ${wins}`);
    for (let i = 1; i <= wins; i++) {
        if (!card_counts[card_index + i]) {
            card_counts[card_index + i] = card_counts[card_index];
        } else {
            card_counts[card_index + i] += card_counts[card_index];
        }
    }
    if (debug) console.log(JSON.stringify(card_counts));
    sum += card_counts[card_index];
    return sum;
}, 0);
console.log(sum);