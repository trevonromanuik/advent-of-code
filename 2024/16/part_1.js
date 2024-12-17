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

let sy, sx;
let ey, ex;
const map = input.replaceAll('\r', '').split('\n').map((line, i) => {
    return line.split('').map((c, j) => {
        if (c === 'S') {
            sy = i;
            sx = j;
            c = '.';
        }
        if (c === 'E') {
            ey = i;
            ex = j;
            c = '.';
        }
        return c;
    });
});

function makeKey(y, x, d) {
    return `${y},${x},${d}`;
}

const costs = new Map([[makeKey(sy, sx, 'E'), 0]]);
const q = [[sy, sx, 'E']];
while (q.length) {
    q.sort(([ay, ax, ad], [by, bx, bd]) => {
        return costs.get(makeKey(ay, ax, ad)) - costs.get(makeKey(by, bx, bd));
    });
    const [y, x, d] = q.shift();
    const c = costs.get(makeKey(y, x, d));
    const [[dy, dx], ccwd, cwd] = {
        'N': [[-1, 0], 'W', 'E'],
        'E': [[0, 1], 'N', 'S'],
        'S': [[1, 0], 'E', 'W'],
        'W': [[0, -1], 'S', 'N'],
    }[d];
    const ny = y + dy;
    const nx = x + dx;
    if (ny === ey && nx === ex) {
        console.log({ cost: c + 1 });
        break;
    }
    if (map[ny][nx] === '.') {
        const nc = c + 1;
        const k = makeKey(ny, nx, d);
        if (!costs.has(k) || nc < costs.get(k)) {
            if (!costs.has(k)) q.push([ny, nx, d]);
            costs.set(k, nc);
        }
    }
    const ccwk = makeKey(y, x, ccwd);
    const ccwc = c + 1000;
    if (!costs.has(ccwk) || ccwc < costs.get(ccwk)) {
        if (!costs.has(ccwk)) q.push([y, x, ccwd]);
        costs.set(ccwk, ccwc);
    }
    const cwk = makeKey(y, x, cwd);
    const cwc = c + 1000;
    if (!costs.has(cwk) || cwc < costs.get(cwk)) {
        if (!costs.has(cwk)) q.push([y, x, cwd]);
        costs.set(cwk, cwc);
    }
}

console.log(`${hrTime() - start}µs`);