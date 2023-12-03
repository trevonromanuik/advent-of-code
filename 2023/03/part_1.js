const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function isNum(line, i) {
    const c = line.charCodeAt(i);
    return c >= 48 && c <= 57;
}

const lines = input.split('\n');
const sum = lines.reduce((sum, line, line_index) => {
    for (let i = 0; i < line.length; i++) {
        if (isNum(line, i)) {
            let j = i + 1;
            for (j; j < line.length; j++) {
                if (!isNum(line, j)) break;
            }
            const n = parseInt(line.substring(i, j));
            if (debug) console.log(n, line_index, i, j);
            let valid = false;
            for (let k = line_index - 1; k <= line_index + 1; k++) {
                if (valid) break;
                if (k < 0 || k >= lines.length) continue;
                for (let l = i - 1; l <= j; l++) {
                    if (l < 0 || l >= line.length) continue;
                    if (k === line_index && l >= i && l < j) continue;
                    if (lines[k][l] !== '.') {
                        valid = true;
                        break;
                    }
                }
            }
            if (valid) sum += n;
            i = j;
        }
    }
    return sum;
}, 0);
console.log(sum);