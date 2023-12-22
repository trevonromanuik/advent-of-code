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

const start = hrTime();

let start_y, start_x;
const map = input.split('\n').map((line, i) => {
    const row = line.split('');
    const j = line.indexOf('S');
    if (j > -1) {
        start_y = i;
        start_x = j;
        row[j] = '.';
    }
    return row;
});
const n_rows = map.length;
const n_cols = map[0].length;

const moves = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

const seen = new Array(n_rows).fill(null).map(() => {
    return new Array(n_cols).fill(false);
});
seen[start_y][start_x] = true;

const MAX_STEPS = test ? 6 : 64;
let stops = 0;
const q = [[start_y, start_x, 0]];
while (q.length) {
    const [y, x, s] = q.shift();
    if (s % 2 === 0) stops++;
    if (s === MAX_STEPS) continue;
    moves.forEach(([dy, dx]) => {
        const ny = y + dy;
        const nx = x + dx;
        if (ny < 0 || ny >= n_rows || nx < 0 || ny >= n_cols) return;
        if (seen[ny][nx]) return;
        if (map[ny][nx] === '#') return;
        q.push([ny, nx, s + 1]);
        seen[ny][nx] = true;
    });
}
if (debug) {
    map.forEach((row, i) => {
        console.log(row.map((c, j) => {
            if (c === '.' && seen[i][j]) {
                return 'O';
            } else {
                return c;
            }
        }).join(''));
    });
}
console.log(stops);
console.log(`${hrTime() - start}µs`);