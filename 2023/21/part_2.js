const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input3.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const map = input.split('\n').map((line, i) => {
    return line.split('');
});
const width = map.length;
const center = (width - 1) / 2;
if (debug) console.log({ width, center });

const moves = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

function bfs(start_y, start_x, max_steps) {

    const seen = new Array(width).fill(null).map(() => {
        return new Array(width).fill(false);
    });
    seen[start_y][start_x] = true;

    const stops = [0, 0];
    const q = [[start_y, start_x, 0]];
    while (q.length) {
        const [y, x, s] = q.shift();
        stops[s % 2]++;
        if (s === max_steps) continue;
        moves.forEach(([dy, dx]) => {
            const ny = y + dy;
            const nx = x + dx;
            if (ny < 0 || ny >= width || nx < 0 || nx >= width) return;
            if (seen[ny][nx]) return;
            if (map[ny][nx] === '#') return;
            q.push([ny, nx, s + 1]);
            seen[ny][nx] = true;
        });
    }
    return stops;

}

const n = test ? 2 : (26501365 - 65) / 131;
const MAX_STEPS = test ? (n * width) + center : 26501365;
const FULL_WIDTH = (MAX_STEPS * 2) + 1;
const FULL_CENTER = (FULL_WIDTH - 1) / 2;
if (debug) console.log({ n, MAX_STEPS, FULL_WIDTH, FULL_CENTER });

const point_steps = MAX_STEPS - ((center + 1) + ((n - 1) * width));
const inner_corner_steps = MAX_STEPS - ((2 * (center + 1)) + ((n - 1) * width));
const outer_corner_steps = MAX_STEPS - ((2 * (center + 1)) + ((n - 2) * width));
if (debug) console.log({ point_steps, inner_corner_steps, outer_corner_steps });

const stop_counts = [
    // full grid
    [center, center, Infinity],
    // N
    [width - 1, center, point_steps],
    // E
    [center, 0, point_steps],
    // S
    [0, center, point_steps],
    // W
    [center, width - 1, point_steps],
    // NW inner
    [width - 1, width - 1, inner_corner_steps],
    // NW outer
    [width - 1, width - 1, outer_corner_steps],
    // NE inner
    [width - 1, 0, inner_corner_steps],
    // NE outer
    [width - 1, 0, outer_corner_steps],
    // SE inner
    [0, 0, inner_corner_steps],
    // SE outer
    [0, 0, outer_corner_steps],
    // SW inner
    [0, width - 1, inner_corner_steps],
    // SW outer
    [0, width - 1, outer_corner_steps],
].map(([start_y, start_x, max_steps]) => {
    return bfs(start_y, start_x, max_steps);
});
if (debug) console.log(stop_counts);

const [k, ak] = MAX_STEPS % 2 === 0 ? [0, 1] : [1, 0];
let k_count = 1;
let ak_count = 0;
for (let i = 1; i < n; i++) {
    if (i % 2 === 0) {
        k_count += i * 4;
    } else {
        ak_count += i * 4;
    }
}
if (debug) console.log({ k, k_count, ak, ak_count });

const full_ks = k_count * stop_counts[0][k];
const full_aks = ak_count * stop_counts[0][ak];
const N = stop_counts[1][n % 2];
const E = stop_counts[2][n % 2];
const S = stop_counts[3][n % 2];
const W = stop_counts[4][n % 2];
const NW_inner = n * stop_counts[5][ak];
const NW_outer = (n - 1) * stop_counts[6][k];
const NE_inner = n * stop_counts[7][ak];
const NE_outer = (n - 1) * stop_counts[8][k];
const SE_inner = n * stop_counts[9][ak];
const SE_outer = (n - 1) * stop_counts[10][k];
const SW_inner = n * stop_counts[11][ak];
const SW_outer = (n - 1) * stop_counts[12][k];
if (debug) console.log({ full_ks, full_aks, N, E, S, W, NW_inner, NW_outer, NE_inner, NE_outer, SE_inner, SE_outer, SW_inner, SW_outer });
console.log(full_ks + full_aks + N + E + S + W + NW_inner + NW_outer + NE_inner + NE_outer + SE_inner + SE_outer + SW_inner + SW_outer);
console.log(`${hrTime() - start}µs`);