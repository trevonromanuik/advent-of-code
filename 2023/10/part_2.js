const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input2.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const lines = input.split('\n');
const rows = new Array(lines.length * 2);
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const row = new Array(line.length * 2);
    for (let j = 0; j < line.length; j++) {
        row[j * 2] = line[j];
        row[j * 2 + 1] = ' ';
    }
    rows[i * 2] = row;
    rows[i * 2 + 1] = new Array(line.length * 2).fill(' ');
}

if (debug) rows.forEach(row => console.log(row.join('')));

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
const direction_keys = Object.keys(directions);

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
        const [r, c] = step(step(s, dir), dir);
        if (r < 0 || r >= n_rows) return false;
        if (c < 0 || c >= n_cols) return false;
        if (rows[r][c] === '.') return false;
        const r_dir = reverse_directions[dir];
        if (pipes[rows[r][c]].includes(r_dir)) return true;
    })) {
        return pipe_key;
    }
});
rows[s[0]][s[1]] = s_pipe;

const loop_nodes = new Set();
const s_dir = pipes[s_pipe][0];
let node = [s, reverse_directions[s_dir]];
do {
    const [[r, c], dir] = node;
    const p = rows[r][c];
    const r_dir = reverse_directions[dir];
    const new_dir = pipes[p].filter(dir => dir !== r_dir)[0];
    node = [step(node[0], new_dir), new_dir];
    loop_nodes.add(`${node[0][0]}:${node[0][1]}`);
    node = [step(node[0], new_dir), new_dir];
    loop_nodes.add(`${node[0][0]}:${node[0][1]}`);
} while (node[0][0] !== s[0] || node[0][1] !== s[1])

let inner_count = 0;
const seen_nodes = new Set(Array.from(loop_nodes));
for (let i = 0; i < n_rows; i += 2) {
    for (let j = 0; j < n_cols; j += 2) {
        const k = `${i}:${j}`;
        if (seen_nodes.has(k)) continue;
        seen_nodes.add(k);
        // flood fill
        if (debug) console.log(`flood fill`, i, j);
        let inside = true;
        let group_count = 1;
        let group_nodes = [[i, j]];
        const q = [[i, j]];
        while (q.length) {
            const [r, c] = q.pop();
            direction_keys.forEach((dir) => {
                const [nr, nc] = step([r, c], dir);
                if (nr < 0 || nr >= n_rows || nc < 0 || nc >= n_cols) {
                    inside = false;
                } else {
                    const k = `${nr}:${nc}`;
                    if (!seen_nodes.has(k)) {
                        if (rows[nr][nc] !== ' ') {
                            group_count++;
                            group_nodes.push([nr, nc]);
                        }
                        seen_nodes.add(k);
                        q.push([nr, nc]);
                    }
                }
            });
        }
        if (debug) console.log(inside, group_count);
        if (inside) inner_count += group_count;
        group_nodes.forEach(([r, c]) => {
            rows[r][c] = inside ? 'I' : 'O';
        });
    }
}
if (debug) rows.forEach(row => console.log(row.join('')));
console.log(inner_count);
console.log(`${hrTime() - start}µs`);