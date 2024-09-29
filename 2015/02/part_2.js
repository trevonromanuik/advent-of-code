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

const sum = input.replaceAll('\r', '').split('\n').reduce((sum, line) => {
    let min_size = Infinity;
    const [l, w, h] = line.split('x').map(n => parseInt(n));
    [[l, w], [w, h], [h, l]].forEach(([x, y]) => {
        const size = 2 * x + 2 * y;
        if (size < min_size) min_size = size;
    });
    const local_size = min_size + (l * w * h);
    console.log(line, local_size);
    return sum + local_size;
}, 0);
console.log(sum);

console.log(`${hrTime() - start}µs`);