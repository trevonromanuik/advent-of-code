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

input.replaceAll('\r', '').split('\n').forEach((line) => {
    let floor = 0;
    for (let i = 0; i < line.length; i++) {
        line[i] === '(' ? floor++ : floor--;
        if (floor === -1) {
            console.log(i + 1);
            break;
        }
    }
});

console.log(`${hrTime() - start}µs`);