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
    'W': [0, -1]
};

const mirrors = {
    '/': {
        'N': ['E'],
        'E': ['N'],
        'S': ['W'],
        'W': ['S']
    },
    '\\': {
        'N': ['W'],
        'E': ['S'],
        'S': ['E'],
        'W': ['N']
    },
    '|': {
        'N': ['N'],
        'E': ['N', 'S'],
        'S': ['S'],
        'W': ['N', 'S']
    },
    '-': {
        'N': ['E', 'W'],
        'E': ['E'],
        'S': ['E', 'W'],
        'W': ['W']
    }
};

const map = input.split('\n').map(row => row.split(''));
const n_rows = map.length;
const n_cols = map[0].length;
const seen = {};
const q = [[0, -1, 'E']];
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
if(debug) {
    Object.entries(seen).forEach(([key, value]) => {
        const [y, x] = key.split(',').map(n => parseInt(n));
        if(map[y][x] === '.') {
            if(value.size === 1) {
                map[y][x] = {
                    'N': '^',
                    'E': '>',
                    'S': 'v',
                    'W': '<'
                }[Array.from(value)[0]];
            } else {
                map[y][x] = value.size;
            }
        }
    });
    map.forEach((row) => {
        console.log(row.join(''));
    });
}
console.log(Object.keys(seen).length);
console.log(`${hrTime() - start}µs`);