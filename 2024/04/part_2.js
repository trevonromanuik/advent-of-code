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

const map = input.replaceAll('\r', '').split('\n').map((line) => {
    return line.split('');
});

let count = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 'A') {
            if (y < 1 || y >= map.length - 1) continue;
            if (x < 1 || x >= map[y].length - 1) continue;
            const ul = map[y - 1][x - 1];
            const ur = map[y - 1][x + 1 ];
            const dl = map[y + 1][x - 1];
            const dr = map[y + 1][x + 1];
            if (ul !== dr && ur !== dl && [ul, ur, dl, dr].every((c) => {
                return c === 'M' || c === 'S';
            })) {
                count++;
            }
        }
    }
}
console.log({ count });

console.log(`${hrTime() - start}µs`);