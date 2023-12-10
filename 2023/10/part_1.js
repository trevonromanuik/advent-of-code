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

const rows = input.split('\n');
const n_rows = rows.length;
const n_cols = rows[0].length;
let s = null;
for (let i = 0; i < n_rows; i++) {
    if (s) break;
    for (let j = 0; j < n_cols; j++) {
        if (rows[i][j] === 'S') {
            s = [i, j];
            break;
        }
    }
}

const directions = {
    'N': [-1, 0],
    'E': [0, 1],
    'S': [1, 0],
    'W': [0, -1],
};

const reverse_directions = {
    'N': 'S',
    'E': 'W',
    'S': 'N',
    'W': 'E',
};

const pipes = {
    '|': ['N', 'S'],
    '-': ['W', 'E'],
    'L': ['N', 'E'],
    'J': ['N', 'W'],
    '7': ['W', 'S'],
    'F': ['E', 'S'],
};
const pipe_keys = Object.keys(pipes);

function step([r, c], dir) {
    const [dr, dc] = directions[dir];
    return [r + dr, c + dc];
}

// figure out what kind of pipe S is
const s_pipe = pipe_keys.find((pipe_key) => {
    const pipe = pipes[pipe_key];
    if (pipe.every((dir) => {
        const [r, c] = step(s, dir);
        if (r < 0 || r >= n_rows) return false;
        if (c < 0 || c >= n_cols) return false;
        if (rows[r][c] === '.') return false;
        const r_dir = reverse_directions[dir];
        if (pipes[rows[r][c]].includes(r_dir)) return true;
    })) {
        return pipe_key;
    }
});

let steps = 1;
let nodes = [
    [step(s, pipes[s_pipe][0]), pipes[s_pipe][0]],
    [step(s, pipes[s_pipe][1]), pipes[s_pipe][1]],
];
while (nodes[0][0][0] !== nodes[1][0][0] || nodes[0][0][1] !== nodes[1][0][1]) {
    if (debug) console.log(nodes);
    nodes = nodes.map(([n, dir]) => {
        const [r, c] = n;
        const p = rows[r][c];
        const r_dir = reverse_directions[dir];
        const new_dir = pipes[p].filter(dir => dir !== r_dir)[0];
        return [step(n, new_dir), new_dir];
    });
    steps++;
}
if (debug) console.log(nodes);
console.log(steps);
console.log(`${hrTime() - start}µs`);