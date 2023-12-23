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

const map = input.split('\n').map((line) => {
    return line.split('');
});
const n_rows = map.length;
const n_cols = map[0].length;
const start_y = 0;
const start_x = map[start_y].indexOf('.');
const end_y = n_rows - 1;
const end_x = map[end_y].indexOf('.');

const moves = {
    'N': [-1, 0],
    'E': [0, 1],
    'S': [1, 0],
    'W': [0, -1],
};
const move_keys = Object.keys(moves);

const reverse_moves = {
    'N': 'S',
    'E': 'W',
    'S': 'N',
    'W': 'E',
};

const slopes = {
    'v': 'N',
    '<': 'E',
    '^': 'S',
    '>': 'W',
};

const segments = {};
const q = [[start_y, start_x, 'S']];
while (q.length) {
    const [start_y, start_x, start_m] = q.pop();
    let y = start_y;
    let x = start_x;
    let m = start_m;
    let s = 0;
    do {
        const [dy, dx] = moves[m];
        y += dy;
        x += dx;
        s++;
        const possible_moves = move_keys.filter((k) => {
            if (k === reverse_moves[m]) return false;
            const [dy, dx] = moves[k];
            const ny = y + dy;
            const nx = x + dx;
            const c = map?.[ny]?.[nx];
            if (!c) return false;
            if (c === '#') return false;
            // if (slopes[c] === k) return false;
            return true;
        });
        if (possible_moves.length === 1) {
            m = possible_moves[0];
        } else {
            const k = `${start_y}:${start_x}`;
            if (!segments[k]) segments[k] = [];
            segments[k].push({
                start_y,
                start_x,
                start_m,
                end_y: y,
                end_x: x,
                steps: s,
            });
            possible_moves.forEach((m) => {
                const k = `${y}:${x}`;
                if (!segments[k]) q.push([y, x, m]);
            });
            break;
        }
    } while(true);
}
if (debug) console.log(segments);

// add all of the missing reverse segments
Object.entries(segments).forEach(([key, paths]) => {
    paths.forEach((p) => {
        const sk = `${p.start_y}:${p.start_x}`;
        const ek = `${p.end_y}:${p.end_x}`;
        if (segments[ek] && !segments[ek].find(({ end_y, end_x }) => {
            return `${end_y}:${end_x}` === sk;
        })) {
            segments[ek].push({
                start_y: p.end_y,
                start_x: p.end_x,
                start_m: reverse_moves[p.start_m],
                end_y: p.start_y,
                end_x: p.start_x,
                steps: p.steps,
            });
        }
    });
});

let max_steps = -Infinity;
function walk(y, x, p, s) {
    if (y === end_y && x === end_x) {
        p.push(`${y}:${x}`);
        const path = [];
        for (let i = 0; i < p.length - 1; i++) {
            const px = segments[p[i]].find(({ end_y, end_x }) => {
                return `${end_y}:${end_x}` === p[i + 1];
            });
            path.push(`${p[i]}:${px.start_m}`);
        }
        if (s > max_steps) {
            max_steps = s;
        }
        return;
    }
    const k = `${y}:${x}`;
    segments[k].forEach(({ end_y, end_x, steps }) => {
        const sk = `${end_y}:${end_x}`;
        if (!p.includes(sk)) {
            walk(end_y, end_x, [...p, k], s + steps);
        }
    });
}
walk(start_y, start_x, [], 0);
console.log(max_steps);
//
//
// const max_paths = {};
// function maxPath(y, x, paths) {
//     let max_path;
//     const k = `${y}:${x}`;
//     if (y === end_y && x === end_x) {
//         max_path = 0;
//     } else {
//
//         if (paths.includes(k)) {
//             max_path = -Infinity;
//         } else {
//             max_path = Math.max(...segments[k].map(({ end_y, end_x, steps }) => {
//                 return steps + maxPath(end_y, end_x, [...paths, k]);
//             }));
//         }
//     }
//     console.log(k, max_path, paths);
//     return max_path;
//     // if (!max_paths[k]) {
//     //     max_paths[k] = Math.max(...segments[k].map(({ end_y, end_x, steps }) => {
//     //         return steps + maxPath(end_y, end_x, [...paths, k]);
//     //     }));
//     // }
//     // console.log(k, max_paths[k], paths);
//     // return max_paths[k];
// }
// console.log(maxPath(start_y, start_x, []));
console.log(`${hrTime() - start}µs`);