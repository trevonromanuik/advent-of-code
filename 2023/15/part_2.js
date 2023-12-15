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

function hash(s) {
    let n = 0;
    for (let i = 0; i < s.length; i++) {
        n += s.charCodeAt(i);
        n *= 17;
        n %= 256;
    }
    return n;
}

const boxes = {};
input.split(',').forEach((instruction) => {
    let i;
    for (i = 0; i < instruction.length; i++) {
        const c = instruction[i];
        if (c === '=' || c === '-') break;
    }
    const label = instruction.substring(0, i);
    const box_n = hash(label);
    const lenses = boxes[box_n] || [];
    if (instruction[i] === '-') {
        boxes[box_n] = lenses.filter((lens) => {
            return lens[0] !== label;
        });
    } else {
        const f = parseInt(instruction.substring(i + 1));
        const j = lenses.findIndex((lens) => {
            return lens[0] === label;
        });
        if (j === -1) {
            lenses.push([label, f]);
        } else {
            lenses[j] = [label, f];
        }
        boxes[box_n] = lenses;
    }
    if (debug) {
        console.log('');
        console.log(`after ${instruction}:`);
        Object.entries(boxes).forEach(([box_n, lenses]) => {
            if (lenses.length) console.log(`${box_n}: ${lenses}`);
        });
    }
});

const sum = Object.entries(boxes).reduce((sum, [box_n, lenses]) => {
    box_n = parseInt(box_n);
    return sum + lenses.reduce((sum, lens, i) => {
        const n = (1 + box_n) * (1 + i) * lens[1];
        if (debug) console.log(`${lens[0]}: ${1 + box_n} * ${i + 1} * ${lens[1]} = ${n}`);
        return sum + n;
    }, 0);
}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);