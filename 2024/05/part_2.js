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

const [rules_chunk, updates_chunk] = input.replaceAll('\r', '').split('\n\n');
const rules = rules_chunk.split('\n').reduce((rules, line) => {
    const [l, r] = line.split('|');
    if (!rules[l]) rules[l] = {};
    rules[l][r] = true;
    return rules;
}, {});

const sum = updates_chunk.split('\n').reduce((sum, line) => {
    const pages = line.split(',');
    let swapped = false;
    let ordered = false;
    while (!ordered) {
        if (debug) console.log(pages);
        ordered = true;
        for (let i = 1; i < pages.length; i++) {
            for (let j = i - 1; j < i; j++) {
                if (rules[pages[i]]?.[pages[j]]) {
                    if (debug) console.log(`${pages[i]} must come before ${pages[j]}`);
                    const t = pages[i];
                    pages[i] = pages[j];
                    pages[j] = t;
                    swapped = true;
                    ordered = false;
                    break;
                }
            }
            if (!ordered) {
                break;
            }
        }
    }
    if (!swapped) return sum;
    return sum + parseInt(pages[Math.floor(pages.length / 2)]);
}, 0);

console.log({ sum });

console.log(`${hrTime() - start}µs`);