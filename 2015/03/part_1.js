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

const visited = new Set([`0,0`]);
let x = 0, y = 0;
input.replaceAll('\r', '').split('\n').forEach((line) => {
    for(let i = 0; i < line.length; i++) {
        switch(line[i]) {
            case '^':
                y -= 1;
                break;
            case '>':
                x += 1;
                break;
            case 'v':
                y += 1;
                break;
            case '<':
                x -= 1;
                break;
        }
        visited.add(`${x},${y}`);
    }
    console.log(line, visited.size);
});

console.log(`${hrTime() - start}µs`);