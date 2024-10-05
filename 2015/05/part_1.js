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

const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
const bad_pairs = new Set(['ab', 'cd', 'pq', 'xy']);
const nice_count = input.replaceAll('\r', '').split('\n').reduce((count, line) => {
    let vowel_count = 0;
    let has_double = false;
    let has_bad_pair = false;
    for (let i = 0; i < line.length; i++) {
        if (vowel_count < 3) {
            if (vowels.has(line[i])) {
                vowel_count++;
            }
        }
        if ((i + 1) < line.length) {
            if (!has_double && line[i] === line[i + 1]) {
                has_double = true;
            }
            if (bad_pairs.has(`${line[i]}${line[i + 1]}`)) {
                has_bad_pair = true;
                break;
            }
        }
    }
    if (vowel_count >= 3 && has_double && !has_bad_pair) {
        if (debug) console.log(line, true);
        count++;
    } else {
        if (debug) console.log(line, false);
    }
    return count;
}, 0);

console.log(nice_count);

console.log(`${hrTime() - start}µs`);