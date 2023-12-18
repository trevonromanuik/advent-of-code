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
    'U': [-1, 0],
    'R': [0, 1],
    'D': [1, 0],
    'L': [0, -1]
};

const adjustments = {
    'U/R': [-0.5, -0.5],
    'U/L': [0.5, -0.5],
    'R/U': [-0.5, -0.5],
    'R/D': [-0.5, 0.5],
    'D/R': [-0.5, 0.5],
    'D/L': [0.5, 0.5],
    'L/U': [0.5, -0.5],
    'L/D': [0.5, 0.5],
};

function polygonArea(points) {
    let area = 0;
    let j = points.length - 1;
    for (let i = 0; i < points.length; i++) {
        area += (points[j][0] - points[i][0]) * (points[j][1] + points[i][1]);
        j = i;
    }
    return area / 2;
}

let y = 0, x = 0;
const lines = input.split('\n').map((line) => {
    const split = line.split(' ');
    const n = parseInt(split[2].substring(2, 7), 16);
    const d = ['R', 'D', 'L', 'U'][parseInt(split[2][7])];
    return [n, d];
});
const points = lines.map(([n, d], i) => {
    const next_d = lines[(i + 1) % lines.length][1];
    const [dy, dx] = directions[d];
    y += dy * n;
    x += dx * n;
    const [ay, ax] = adjustments[`${d}/${next_d}`];
    return [y + ay, x + ax];
});
console.log(-polygonArea(points));
console.log(`${hrTime() - start}µs`);