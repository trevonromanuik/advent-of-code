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

const black_tiles = new Set();
input.replaceAll('\r').split('\n').forEach((line) => {
    let x = 0, y = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 'e') {
            x++;
        } else if (line[i] === 's') {
            y--;
            if (line[++i] == 'e') x++;
        } else if (line[i] === 'w') {
            x--;
        } else if (line[i] === 'n') {
            y++;
            if (line[++i] === 'w') x--;
        }
    }
    const k = `${x},${y}`;
    if (black_tiles.has(k)) black_tiles.delete(k);
    else black_tiles.add(k);
});

console.log({ count: black_tiles.size });
console.log(`${hrTime() - start}µs`);