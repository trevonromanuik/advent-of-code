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
    const visited = new Set([`0,0`]);
    let xs = [0, 0], ys = [0, 0];
    for(let i = 0; i < line.length; i++) {
        const j = i % 2;
        switch(line[i]) {
            case '^':
                ys[j] -= 1;
                break;
            case '>':
                xs[j] += 1;
                break;
            case 'v':
                ys[j] += 1;
                break;
            case '<':
                xs[j] -= 1;
                break;
        }
        visited.add(`${xs[j]},${ys[j]}`);
    }
    console.log(line, visited.size);
});

console.log(`${hrTime() - start}µs`);