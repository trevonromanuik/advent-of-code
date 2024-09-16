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

const cups = input.split('').map(c => parseInt(c));
const num_moves = 100;
for (let move = 0; move < num_moves; move++) {
    if (debug) console.log(`-- move ${move + 1} --`);
    if (debug) console.log(`cups: ${cups.join(' ')}`);
    const current_cup = cups.shift();
    cups.push(current_cup);
    const removed_cups = cups.splice(0, 3);
    if (debug) console.log(`pick up: ${removed_cups.join(' ')}`);
    let destination_cup = current_cup;
    let destination_index = null;
    while (destination_index === null) {
        destination_cup -= 1;
        if (destination_cup < 1) destination_cup += 9;
        const index = cups.indexOf(destination_cup);
        if (index > -1) destination_index = index;
    }
    if (debug) console.log(`destination: ${destination_cup}`);
    if (debug) console.log(``);
    cups.splice(destination_index + 1, 0, ...removed_cups);
}

const index = cups.indexOf(1);
console.log([].concat(cups.slice(index + 1), cups.slice(0, index)).join(''));

console.log(`${hrTime() - start}µs`);