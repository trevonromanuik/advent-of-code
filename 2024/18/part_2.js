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
}

const n_lines = test ? 12 : 1024;
const lines = input.replaceAll('\r', '').split('\n');
for (let n = n_lines; n < lines.length; n++) {
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            map[i][j] = 0;
        }
    }

    for (let i = 0; i < n; i++) {
        const [x, y] = lines[i].split(',').map((n) => {
            return parseInt(n);
        });
        map[y][x] = Infinity;
    }

    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    let found = false;
    const q = [[0, 0]];
    while (q.length && !found) {
        const [y, x] = q.shift();
        const c = map[y][x];
        for (let i = 0; i < dirs.length; i++) {
            const [dy, dx] = dirs[i];
            const ny = y + dy;
            const nx = x + dx;
            if (ny === h - 1 && nx === w - 1) {
                found = true;
                break;
            }
            if (map[ny]?.[nx] === undefined) continue;
            if (map[ny]?.[nx] > 0) continue;
            map[ny][nx] = c + 1;
            q.push([ny, nx]);
        }
    }
    if (!found) {
        console.log({ n, line: lines[n - 1] });
        break;
    }
}

console.log(`${hrTime() - start}µs`);