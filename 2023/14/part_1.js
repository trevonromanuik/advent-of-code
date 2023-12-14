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

const map = input.split('\n').map((line) => {
    return line.split('');
});
const n_rows = map.length;
const n_cols = map[0].length;

let sum = 0;
for (let i = 0; i < n_cols; i++) {
    let last_j = -1;
    for (let j = 0; j < n_rows; j++) {
        switch (map[j][i]) {
            case '.':
                break;
            case 'O':
                last_j++;
                sum += n_rows - last_j;
                break;
            case '#':
                last_j = j;
                break;
        }
    }
}
console.log(sum);
console.log(`${hrTime() - start}µs`);