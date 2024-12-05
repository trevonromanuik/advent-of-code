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
        if (map[y][x] === 'X') {
            // check all 8 directions for XMAS
            [
                [-1, 0], // U
                [1, 0], // D
                [0, -1], // L
                [0, 1], // R
                [-1, -1], // UL
                [-1, 1], // UR
                [1, -1], // DL
                [1, 1], // UR
            ].forEach(([dy, dx]) => {
                let ny = y + (3 * dy);
                if (ny < 0 || ny >= map.length) return;
                let nx = x + (3 * dx);
                if (nx < 0 || nx >= map[y].length) return;
                ny = y;
                nx = x;
                let letters = ['M', 'A', 'S'];
                for (let i = 0; i < letters.length; i++) {
                    ny += dy;
                    nx += dx;
                    if (map[ny][nx] !== letters[i]) return;
                }
                count++;
            });
        }
    }
}
console.log({ count });

console.log(`${hrTime() - start}µs`);