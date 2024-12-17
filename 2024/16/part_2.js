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

function makeKey(y, x, d = '') {
    return `${y},${x},${d}`;
}

let ed;
const costs = new Map([[makeKey(sy, sx, 'E'), 0]]);
const prevs = new Map([[makeKey(sy, sx, 'E'), []]]);
let min_cost = Infinity;
const q = [[sy, sx, 'E']];
while (q.length) {
    q.sort(([ay, ax, ad], [by, bx, bd]) => {
        return costs.get(makeKey(ay, ax, ad)) - costs.get(makeKey(by, bx, bd));
    });
    const [y, x, d] = q.shift();
    const k = makeKey(y, x, d);
    const c = costs.get(k);
    if (y === ey && x === ex) {
        min_cost = c;
        ed = d;
        console.log(min_cost);
    }
    if (c >= min_cost) continue;
    const [[dy, dx], ccwd, cwd] = {
        'N': [[-1, 0], 'W', 'E'],
        'E': [[0, 1], 'N', 'S'],
        'S': [[1, 0], 'E', 'W'],
        'W': [[0, -1], 'S', 'N'],
    }[d];
    const ny = y + dy;
    const nx = x + dx;
    if (map[ny][nx] === '.') {
        const nc = c + 1;
        const nk = makeKey(ny, nx, d);
        const pc = costs.get(nk);// || Infinity;
        if (!costs.has(nk) || nc <= pc) {
            if (!costs.has(nk)) q.push([ny, nx, d]);
            costs.set(nk, nc);
            if (!prevs.has(nk) || nc < pc) {
                prevs.set(nk, [k]);
            } else {
                prevs.get(nk).push(k);
            }
        }
    }
    const ccwk = makeKey(y, x, ccwd);
    const ccwc = c + 1000;
    if (!costs.has(ccwk) || ccwc < costs.get(ccwk)) {
        if (!costs.has(ccwk)) q.push([y, x, ccwd]);
        costs.set(ccwk, ccwc);
        if (!prevs.has(ccwk) || ccwc < costs.get(ccwk)) {
            prevs.set(ccwk, [k]);
        } else {
            prevs.get(ccwk).push(k);
        }
    }
    const cwk = makeKey(y, x, cwd);
    const cwc = c + 1000;
    if (!costs.has(cwk) || cwc < costs.get(cwk)) {
        if (!costs.has(cwk)) q.push([y, x, cwd]);
        costs.set(cwk, cwc);
        if (!prevs.has(cwk) || cwc < costs.get(cwk)) {
            prevs.set(cwk, [k]);
        } else {
            prevs.get(cwk).push(k);
        }
    }
}

const ek = makeKey(ey, ex, ed);
const seen = new Set([ek]);
const seen2 = new Set([makeKey(ey, ex)]);
const pq = [ek];
while (pq.length) {
    const k = pq.shift();
    prevs.get(k).forEach((k2) => {
        if (!seen.has(k2)) {
            seen.add(k2);
            pq.push(k2);
        }
        const s = k2.split(',');
        const s2 = makeKey(s[0], s[1]);
        if (!seen2.has(s2)) seen2.add(s2);
    });
}

if (debug) {
    console.log(map.map((row, y) => {
        return row.map((c, x) => {
            const k = makeKey(y, x);
            if (seen2.has(k)) return 'O';
            return c;
        }).join('');
    }).join('\n'));
}

console.log({ count: seen2.size });
console.log(`${hrTime() - start}µs`);