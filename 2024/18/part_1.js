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

const [h, w] = test ? [7, 7] : [71, 71];
const map = new Array(h);
for (let i = 0; i < h; i++) {
    map[i] = new Array(w);
    for (let j = 0; j < w; j++) {
        map[i][j] = 0;
    }
}

const n_lines = test ? 12 : 1024;
const lines = input.replaceAll('\r', '').split('\n');
for (let i = 0; i < n_lines; i++) {
    const [x, y] = lines[i].split(',').map((n) => {
        return parseInt(n);
    });
    map[y][x] = Infinity;
}
map[0][0] = 0;

const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

const q = [[0, 0]];
loop: while (q.length) {
    const [y, x] = q.shift();
    const c = map[y][x];
    for (let i = 0; i < dirs.length; i++) {
        const [dy, dx] = dirs[i];
        const ny = y + dy;
        const nx = x + dx;
        if (ny === h - 1 && nx === w - 1) {
            console.log({ cost: c + 1 });
            break loop;
        }
        if (map[ny]?.[nx] === undefined) continue;
        if (map[ny]?.[nx] > 0) continue;
        map[ny][nx] = c + 1;
        q.push([ny, nx]);
    }
}

console.log(`${hrTime() - start}µs`);