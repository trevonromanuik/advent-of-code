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

let n = parseInt(input).toString();
for(let i = 0; i < 50; i++) {
    let new_n = '';
    for (let j = 0; j < n.length; j++) {
        const c = n[j];
        let k;
        for (k = j; k < n.length; k++) {
            if (n[k] !== c) break;
        }
        new_n += `${k - j}${c}`;
        j = k - 1;
    }
    // console.log(i, ':', n, '->', new_n);
    n = new_n;
}
console.log(n.length);

console.log(`${hrTime() - start}µs`);