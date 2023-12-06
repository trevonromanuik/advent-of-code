const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

const [time, distance] = input.split('\n').map((line) => {
    return parseInt(line.split(/\s+/).slice(1).join(''));
});
if (debug) console.log({ time });
if (debug) console.log({ distance });

let i = 0;
for (i; i <= time; i++) {
    if ((time - i) * i > distance) {
        break;
    }
}

let j = time;
for (j; j >= 0; j--) {
    if ((time - j) * j > distance) {
        break;
    }
}

if (debug) console.log({ i, j });
console.log(j - i + 1);
console.log(`${Date.now() - start}ms`);