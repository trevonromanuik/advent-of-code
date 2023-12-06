const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

const [times, distances] = input.split('\n').map((line) => {
    return line.split(/\s+/).slice(1).map(n => parseInt(n));
});
if (debug) console.log(times);
if (debug) console.log(distances);

const p = times.reduce((p, time, index) => {
    const max_distance = distances[index];
    const t = Math.floor(time / 2);
    let i = t - 1;
    for (i; i >= 0; i--) {
        if ((time - i) * i <= max_distance) {
            i += 1;
            break;
        }
    }
    let j = t + 1;
    for (j; j < time; j++) {
        if ((time - j) * j <= max_distance) {
            j -= 1;
            break;
        }
    }
    if (debug) console.log(p, i, j, (j - i + 1));
    return p * (j - i + 1);
}, 1);

console.log(p);
console.log(`${Date.now() - start}ms`);