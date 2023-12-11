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

const lines = input.split('\n');
let n_rows = lines.length;
let n_cols = lines[0].length;

const empty_rows = [];
for (let i = 0; i < n_rows; i++) {
    let empty = true;
    for (let j = 0; j < n_cols; j++) {
        if (lines[i][j] !== '.') {
            empty = false;
            break;
        }
    }
    if (empty) empty_rows.push(i);
}

const empty_cols = [];
for (let i = 0; i < n_cols; i++) {
    let empty = true;
    for (let j = 0; j < n_rows; j++) {
        if (lines[j][i] !== '.') {
            empty = false;
            break;
        }
    }
    if (empty) empty_cols.push(i);
}

if (debug) console.log(n_rows, empty_rows, n_cols, empty_cols);

const galaxies = [];
let empty_row_index = 0;
for (let i = 0; i < n_rows; i++) {
    if (i === empty_rows[empty_row_index]) {
        empty_row_index++;
        continue;
    }
    let empty_col_index = 0;
    for (let j = 0; j < n_cols; j++) {
        if (j === empty_cols[empty_col_index]) {
            empty_col_index++;
            continue;
        }
        if (lines[i][j] === '#') {
            galaxies.push([i + empty_row_index, j + empty_col_index]);
        }
    }
}

if (debug) console.log(galaxies);

let sum = 0;
for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        sum += Math.abs(galaxies[i][0] - galaxies[j][0]);
        sum += Math.abs(galaxies[i][1] - galaxies[j][1]);
    }
}
console.log(sum);
console.log(`${hrTime() - start}µs`);