const fs = require('fs');
const npath = require('path');

const test = false
const debug = false
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(npath.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

let sy, sx, ey, ex;
const map = input.replaceAll('\r', '').split('\n').map((line, y) => {
    return line.split('').map((c, x) => {
        if (c === 'S') {
            sy = y;
            sx = x;
            return 0;
        }
        if (c === 'E') {
            ey = y;
            ex = x;
            return null;
        }
        if (c === '.') {
            return null;
        }
        return Infinity;
    });
});

const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
];

let y = sy;
let x = sx;
const path = [[y, x]];
while (y !== ey || x !== ex) {
    const c = map[y][x];
    for (let i = 0; i < dirs.length; i++) {
        const [dy, dx] = dirs[i];
        const ny = y + dy;
        const nx = x + dx;
        if (map[ny][nx] === null) {
            map[ny][nx] = c + 1;
            path.push([ny, nx]);
            y = ny;
            x = nx;
            break;
        }
    }
}

const cheat_threshold = test ? 50 : 100;
let cheat_count = 0;
const cheat_counts = new Map();
for (let i = 0; i < path.length; i++) {
    const [py, px] = path[i];
    const pc = map[py][px];
    for (let dy = -20; dy <= 20; dy++) {
        for (let dx = -20; dx <= 20; dx++) {
            const md = Math.abs(dy) + Math.abs(dx);
            if (md > 20) continue;
            const ny = py + dy;
            const nx = px + dx;
            const nc = map[ny]?.[nx];
            if (nc === undefined) continue;
            if (nc === Infinity) continue;
            if (md > 1 && nc > pc) {
                const dc = nc - pc - md;
                if (dc >= cheat_threshold) {
                    cheat_count++;
                    if (!cheat_counts.has(dc)) cheat_counts.set(dc, 1);
                    else cheat_counts.set(dc, cheat_counts.get(dc) + 1);
                }
            }
        }
    }
}

if (debug) {
    [...cheat_counts.keys()].map((n) => {
        return parseInt(n);
    }).sort((a, b) => {
        return a - b;
    }).forEach((n) => {
        console.log(`${n}: ${cheat_counts.get(n)}`);
    });
}

console.log({ cheat_count });
console.log(`${hrTime() - start}µs`);