const fs = require('fs');
const path = require('path');

const test = false;
let debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const NUMPAD = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', 'A'],
];

const DIRPAD = [
    [null, '^', 'A'],
    ['<', 'v', '>'],
];

const DIRS = [
    ['^', -1, 0],
    ['v', 1, 0],
    ['<', 0, -1],
    ['>', 0, 1],
];

function parseMap(map) {
    const paths = {};
    const costs = {};
    for (let sy = 0; sy < map.length; sy++) {
        for (let sx = 0; sx < map[sy].length; sx++) {
            const sc = map[sy][sx];
            if (!sc) continue;
            paths[sc] = { [sc]: ['A'] };
            costs[sc] = { [sc]: 1 };
            const q = [[sy, sx, '']];
            while (q.length) {
                const [y, x, p] = q.shift();
                for (let i = 0; i < DIRS.length; i++) {
                    const [dp, dy, dx] = DIRS[i];
                    const ny = y + dy;
                    const nx = x + dx;
                    const nc = map[ny]?.[nx];
                    if (!nc) continue;
                    const np = p + dp;
                    if (!paths[sc][nc]) {
                        paths[sc][nc] = [np + 'A'];
                        costs[sc][nc] = np.length + 1;
                        q.push([ny, nx, np]);
                    } else if (np.length <= costs[sc][nc]) {
                        paths[sc][nc].push(np + 'A');
                        q.push([ny, nx, np]);
                    }
                }
            }
        }
    }
    return paths;
}

const DIRPATHS = parseMap(DIRPAD);
const NUMPATHS = parseMap(NUMPAD);

function expandPath(path, PATHS, pchar='A') {
    const paths = PATHS[pchar][path[0]];
    if (path.length === 1) {
        return paths;
    } else {
        const subpaths = expandPath(path.substring(1), PATHS, path[0]);
        const npaths = [];
        for (let i = 0; i < paths.length; i++) {
            for (let j = 0; j < subpaths.length; j++) {
                npaths.push(paths[i] + subpaths[j]);
            }
        }
        return npaths;
    }
}


function trimPaths(PATHS) {
    const keys = Object.keys(PATHS);
    for (let i = 0; i < keys.length; i++) {
        const ik = keys[i];
        for (let j = 0; j < keys.length; j++) {
            const jk = keys[j];
            const paths = PATHS[ik][jk];
            if (paths.length > 1) {
                const q = {};
                paths.forEach((path) => q[path] = [path]);
                for (let i = 0; i < 5; i++) {
                    let min_length = Infinity;
                    const keys = Object.keys(q);
                    if (keys.length === 1) break;
                    for (let j = 0; j < keys.length; j++) {
                        const k = keys[j];
                        if (q[k]) {
                            q[k] = q[k].map((p) => {
                                return expandPath(p, DIRPATHS);
                            }).flat();
                            if (q[k][0].length < min_length) {
                                min_length = q[k][0].length;
                            }
                        }
                    }
                    for (let j = 0; j < keys.length; j++) {
                        const k = keys[j];
                        if (q[k]) {
                            if (q[k][0].length !== min_length) {
                                delete q[k];
                            }
                        }
                    }
                }
                PATHS[ik][jk] = Object.keys(q);
            }
        }
    }
}
trimPaths(DIRPATHS);
trimPaths(NUMPATHS);

function addPairCounts(path, pair_counts, n = 1) {
    for (let i = 1; i < path.length; i++) {
        const pair = path.substring(i - 1, i + 1);
        if (!pair_counts[pair]) pair_counts[pair] = 0;
        pair_counts[pair] += n;
    }
}


const N_DIRPADS = 26;
const sum = input.replaceAll('\r', '').split('\n').reduce((sum, line) => {
    let path = 'A' + line;
    let pair_counts = {};
    addPairCounts(path, pair_counts);
    for (let n = 0; n < N_DIRPADS; n++) {
        const PATHS = n ? DIRPATHS : NUMPATHS;
        const npair_counts = {};
        Object.keys(pair_counts).forEach((pair) => {
            addPairCounts('A' + PATHS[pair[0]][pair[1]][0], npair_counts, pair_counts[pair]);
        });
        pair_counts = npair_counts;
    }
    const length = Object.values(pair_counts).reduce((sum, n) => sum + n);
    const complexity = length * parseInt(line);
    console.log(line, complexity);
    return sum + complexity;
}, 0);
console.log(sum);

console.log(`${hrTime() - start}µs`);