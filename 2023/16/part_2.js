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

const directions = {
    'N': [-1, 0],
    'E': [0, 1],
    'S': [1, 0],
    'W': [0, -1],
};

const mirrors = {
    '/': {
        'N': ['E'],
        'E': ['N'],
        'S': ['W'],
        'W': ['S'],
    },
    '\\': {
        'N': ['W'],
        'E': ['S'],
        'S': ['E'],
        'W': ['N'],
    },
    '|': {
        'N': ['N'],
        'E': ['N', 'S'],
        'S': ['S'],
        'W': ['N', 'S'],
    },
    '-': {
        'N': ['E', 'W'],
        'E': ['E'],
        'S': ['E', 'W'],
        'W': ['W'],
    },
};

const map = input.split('\n').map(row => row.split(''));
const n_rows = map.length;
const n_cols = map[0].length;
let max_energized = 0;
const start_nodes = [];
for (let y = 0; y < n_rows; y++) {
    start_nodes.push([y, -1, 'E']);
    start_nodes.push([y, n_cols, 'W']);
}
for (let x = 0; x < n_cols; x++) {
    start_nodes.push([-1, x, 'S']);
    start_nodes.push([n_rows, x, 'N']);
}
start_nodes.forEach((start_node) => {
    const seen = {};
    const q = [start_node];
    while(q.length) {
        let [y, x, dir] = q.pop();
        while(true) {
            const [dy, dx] = directions[dir];
            y = y + dy;
            x = x + dx;
            if(y < 0 || y >= n_rows || x < 0 || x >= n_cols) break;
            const k = `${y},${x}`;
            if(!seen[k]) {
                seen[k] = new Set([dir]);
            } else if(!seen[k].has(dir)) {
                seen[k].add(dir);
            } else {
                break;
            }
            const c = map[y][x];
            if(mirrors[c]) {
                if(mirrors[c][dir][1]) {
                    q.push([y, x, mirrors[c][dir][1]]);
                }
                dir = mirrors[c][dir][0];
            }
        }
    }
    const energized = Object.keys(seen).length;
    if(energized > max_energized) {
        if(debug) {
            let new_map = [...map.map(row => [...row])];
            Object.entries(seen).forEach(([key, value]) => {
                const [y, x] = key.split(',').map(n => parseInt(n));
                if (new_map[y][x] === '.') {
                    if (value.size === 1) {
                        new_map[y][x] = {
                            'N': '^',
                            'E': '>',
                            'S': 'v',
                            'W': '<',
                        }[Array.from(value)[0]];
                    } else {
                        new_map[y][x] = value.size;
                    }
                }
            });
            new_map.forEach((row) => {
                console.log(row.join(''));
            });
            console.log(start_node, energized);
        }
        max_energized = energized;
    }
});
console.log(max_energized)
console.log(`${hrTime() - start}µs`);