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

function move(y, x, d) {
    const [dy, dx] = directions[d];
    y += dy;
    x += dx;
    if (y < 0 || y >= n_rows || x < 0 || x >= n_cols) return null;
    return { y, x };
}

const start_nodes = [
    toNode(0, 0, 'E', 0),
    toNode(0, 0, 'S', 0),
];
const costs = start_nodes.reduce((costs, n) => {
    costs[n.k] = 0;
    return costs;
}, {});
const prevs = {};
const q = [...start_nodes];

function moveAndAdd(y, x, d, s, k, n) {
    let r = { y, x };
    let c = costs[k];
    let i = 0;
    for (i; i < n; i++) {
        r = move(r.y, r.x, d);
        if (!r) break;
        c += map[r.y][r.x];
    }
    if (r && i === n) {
        const node = toNode(r.y, r.x, d, s + n);
        if (!costs[node.k]) {
            const node_cost = c + (n_rows - node.y) + (n_cols - node.x);
            const index = q.findIndex((n) => {
                return node_cost < (costs[n.k] + (n_rows - n.y) + (n_cols - n.x));
            });
            if (index === -1) {
                q.push(node);
            } else {
                q.splice(index, 0, node);
            }
        }
        if (c < (costs[node.k] || Infinity)) {
            prevs[node.k] = k;
            costs[node.k] = c;
        }
    }
}

while (q.length) {
    const { y, x, d, s, k } = q.shift();
    if (y === n_rows - 1 && x === n_cols - 1 && s >= 4) {
        console.log(costs[k]);
        if (debug) {
            const path = [];
            let p = k;
            do {
                path.unshift(p);
                p = prevs[p];
            } while(p);
            console.log(path.join('/'));
        }
        break;
    }
    if (s < 10) {
        // keep going straight
        const n = s < 4 ? 4 - s : 1;
        moveAndAdd(y, x, d, s, k, n);
    }
    if (s >= 4) {
        // turn and move 4
        turns[d].forEach((d) => {
            moveAndAdd(y, x, d, 0, k, 4);
        });
    }
}

console.log(`${hrTime() - start}µs`);