const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const hail = input.split('\n').map((line) => {
    const [[x, y, z], [vx, vy, vz]] = line.split(' @ ').map((s) => {
        return s.split(', ').map((n) => {
            return parseInt(n);
        });
    });
    return {
        x1: x,
        x2: x + vx,
        vx: vx,
        y1: y,
        y2: y + vy,
        vy: vy,
        z1: z,
        z2: z + vz,
        vz: vz,
    };
});

const MIN_VALUE = test ? 7 : 200000000000000;
const MAX_VALUE = test ? 27 : 400000000000000;

function checkLineIntersection(h1, h2) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    const denominator = ((h2.y2 - h2.y1) * (h1.x2 - h1.x1)) - ((h2.x2 - h2.x1) * (h1.y2 - h1.y1));
    if (denominator === 0) return null;
    const a = h1.y1 - h2.y1;
    const b = h1.x1 - h2.x1;
    const numerator = ((h2.x2 - h2.x1) * a) - ((h2.y2 - h2.y1) * b);
    const c = numerator / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    const x = h1.x1 + (c * (h1.x2 - h1.x1));
    const y = h1.y1 + (c * (h1.y2 - h1.y1));

    if (x < MIN_VALUE || x > MAX_VALUE) return null;
    if (y < MIN_VALUE || y > MAX_VALUE) return null;

    const t1 = (x - h1.x1) / h1.vx;
    const t2 = (x - h2.x1) / h2.vx;
    if (t1 < 0 || t2 < 0) return null;

    return { x, y };
}

let count = 0;
for (let i = 0; i < hail.length; i++) {
    for (let j = i + 1; j < hail.length; j++) {
        const r = checkLineIntersection(hail[i], hail[j]);
        if (r) {
            if (debug) console.log(i, j, r);
            count++;
        }
    }
}
console.log(count);
console.log(`${hrTime() - start}µs`);