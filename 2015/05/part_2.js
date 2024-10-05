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

const nice_count = input.replaceAll('\r', '').split('\n').reduce((count, line) => {
    const pairs = {};
    let has_double = false;
    for (let i = 0; i < line.length; i++) {
        if ((i + 1) < line.length) {
            const pair = `${line[i]}${line[i + 1]}`;
            if (!pairs[pair]) pairs[pair] = [];
            pairs[pair].push(i);
        }
        if (!has_double && (i + 2) < line.length) {
            if (line[i] === line[i + 2]) {
                has_double = true;
            }
        }
    }
    const nice = has_double && Object.keys(pairs).find((key) => {
        if (pairs[key].length < 2) {
            return false;
        }
        for (let i = 0; i < pairs[key].length - 1; i++) {
            for (let j = i + 1; j < pairs[key].length; j++) {
                if ((pairs[key][j] - pairs[key][i]) > 1) return true;
            }
        }
        return false;
    })
    if (nice) {
        if (debug) console.log(line, true);
        count++;
    } else {
        if (debug) console.log(line, false);
    }
    return count;
}, 0);

console.log(nice_count);

console.log(`${hrTime() - start}µs`);