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

const antennae = {};
const map = input.replaceAll('\r', '').split('\n').map((line, y) => {
    const row = line.split('');
    row.forEach((c, x) => {
        if (c !== '.') {
            if (!antennae[c]) antennae[c] = [];
            antennae[c].push([y, x]);
        }
    });
    return row;
});

const h = map.length;
const w = map[0].length;

const antinodes = Object.keys(antennae).reduce((antinodes, key) => {
    for (let i = 0; i < antennae[key].length; i++) {
        const [yi, xi] = antennae[key][i];
        for (let j = i + 1; j < antennae[key].length; j++) {
            const [yj, xj] = antennae[key][j];
            const dy = yj - yi;
            const dx = xj - xi;
            let ny, nx;
            ny = yi;
            nx = xi;
            while (true) {
                ny = ny + dy;
                nx = nx + dx;
                if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                    if (debug) console.log({ key, yi, xi, yj, xj, ny, nx });
                    antinodes.add(`${ny},${nx}`);
                } else {
                    break;
                }
            }
            ny = yj;
            nx = xj;
            while (true) {
                ny = ny - dy;
                nx = nx - dx;
                if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                    if (debug) console.log({ key, yi, xi, yj, xj, ny, nx });
                    antinodes.add(`${ny},${nx}`);
                } else {
                    break;
                }
            }
        }
    }
    return antinodes;
}, new Set());

console.log({ count: antinodes.size });
console.log(`${hrTime() - start}µs`);