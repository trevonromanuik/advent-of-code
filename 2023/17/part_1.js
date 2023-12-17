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

const map = input.split('\n').map((row) => {
    return row.split('').map(n => parseInt(n));
});
const n_rows = map.length;
const n_cols = map[0].length;

const directions = {
    'N': [-1, 0],
    'E': [0, 1],
    'S': [1, 0],
    'W': [0, -1]
};

const turns = {
    'N': ['E', 'W'],
    'E': ['S', 'N'],
    'S': ['E', 'W'],
    'W': ['S', 'N'],
};

function toNode(y, x, d, s) {
    return { y, x, d, s, k: toKey(y, x, d, s) }
}

function toKey(y, x, d, s) {
    return `${y}:${x}:${d}:${s}`;
}

function move(y, x, dir) {
    const [dy, dx] = directions[dir];
    y += dy;
    x += dx;
    if (y < 0 || y >= n_rows || x < 0 || x >= n_cols) return null;
    return { y, x };
}

const start_node = toNode(0, 0, 'E', 0);
const costs = {
    [start_node.k]: 0,
};
const q = [start_node];

function moveAndAdd(y, x, d, s, k) {
    const r = move(y, x, d);
    if (r) {
        const n = toNode(r.y, r.x, d, s + 1);
        const c = costs[k] + map[r.y][r.x];
        if (!costs[n.k]) {
            costs[n.k] = c;
            q.push(n);
        } else if (c < costs[n.k]) {
            costs[n.k] = c;
        }
    }
}

while (q.length) {
    q.sort(({ k: k1 }, { k: k2 }) => {
        return costs[k1] < costs[k2] ? 1 : -1;
    });
    const { y, x, d, s, k } = q.pop();
    if (y === n_rows - 1 && x === n_cols - 1) {
        console.log(costs[k]);
        break;
    }
    if (s < 3) {
        // keep going straight
        moveAndAdd(y, x, d, s, k);
    }
    turns[d].forEach((d) => {
        // turn and move
        moveAndAdd(y, x, d, 0, k);
    });
}

console.log(`${hrTime() - start}µs`);