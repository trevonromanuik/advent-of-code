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

let y = 0;
let x = 0;
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
let dir = 0;
const seen = new Set();
const map = input.replaceAll('\r', '').split('\n').map((line, i) => {
    return line.split('').map((c, j) => {
        if (c === '^') {
            y = i;
            x = j;
            c = '.';
        }
        return c;
    });
});
const h = map.length;
const w = map[0].length;

while (y >= 0 && y < h && x >= 0 && x < w) {
    seen.add(`${x},${y}`);
    const ny = y + dirs[dir][0];
    const nx = x + dirs[dir][1];
    if (map[ny]?.[nx] === '#') {
        dir = ++dir % dirs.length;
    } else {
        y = ny;
        x = nx;
    }
}

console.log(seen.size);

console.log(`${hrTime() - start}µs`);