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
        if (line[i] === '*') {
            const ns = [];
            for (let j = line_index - 1; j <= line_index + 1; j++) {
                if (j < 0 || j >= lines.length) continue;
                for (let k = i - 1; k <= i + 1; k++) {
                    if (k < 0 || k >= line.length) continue;
                    if (isNum(lines[j][k])) {
                        let l, r;
                        for (l = k - 1; l >= 0; l--) {
                            if (!isNum(lines[j][l])) break;
                        }
                        for (r = k + 1; r < lines[j].length; r++) {
                            if (!isNum(lines[j][r])) break;
                        }
                        ns.push(parseInt(lines[j].substring(l + 1, r)));
                        k = r;
                    }
                }
            }
            if (ns.length === 2) sum += (ns[0] * ns[1]);
        }
    }
    return sum;
}, 0);
console.log(sum);