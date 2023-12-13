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

function rotate(a) {
    const r = new Array(a[0].length);
    for (let i = 0; i < r.length; i++) {
        const ri = new Array(a.length);
        for (let j = 0; j < a.length; j++) {
            ri[j] = a[j][i];
        }
        r[i] = ri.join('');
    }
    return r;
}

function findMirrorIndex(a) {
    let index = null;
    for (let i = 0; i < a.length - 1; i++) {
        let found = true;
        for (let j = 0; j <= i; j++) {
            if (!found) break;
            const l = a[i - j];
            const r = a[i + j + 1];
            if (!r) break;
            if (l !== r) {
                found = false;
                break;
            }
        }
        if (found) {
            index = i + 1;
            break;
        }
    }
    return index;
}

const start = hrTime();
const sum = input.split('\n\n').reduce((sum, chunk, n) => {

    const rows = chunk.split('\n');
    const row_index = findMirrorIndex(rows);
    if (row_index !== null) {
        if (debug) console.log(n, 'row', row_index);
        return sum + (100 * row_index);
    }

    const cols = rotate(rows);
    const col_index = findMirrorIndex(cols);
    if (col_index !== null) {
        if (debug) console.log(n, 'col', col_index);
        return sum + col_index;
    }

    console.log(n, 'error');
    return sum;

}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);