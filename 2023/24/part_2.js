const fs = require('fs');
const path = require('path');

const { intersect } = require('mathjs');

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

function checkLineIntersection(h1, h2) {

    const r = intersect(
        [h1.x1, h1.y1, h1.z1],
        [h1.x2, h1.y2, h1.z2],
        [h2.x1, h2.y1, h2.z1],
        [h2.x2, h2.y2, h2.z2],
    );

    if (!r) return null;
    const t = (r[0] - h2.x1) / h2.vx;
    if (t < 0) return null;
    return r;

}

let found = false;
const MAX_TIME = 100;
for (let i = 0; i < hail.length; i++) {
    if (found) break;
    const h1 = hail[i];
    for (let j = 0; j < hail.length; j++) {
        console.log(`${i}/${j}`);
        if (i === j) continue;
        if (found) break;
        const h2 = hail[j];
        for (let t1 = 1; t1 < MAX_TIME; t1++) {
            if (found) break;
            for (let t2 = t1 + 1; t2 < t1 + MAX_TIME; t2++) {
                if (found) break;
                const x1 = h1.x1 + (t1 * h1.vx);
                const x2 = h2.x1 + (t2 * h2.vx);
                const y1 = h1.y1 + (t1 * h1.vy);
                const y2 = h2.y1 + (t2 * h2.vy);
                const z1 = h1.z1 + (t1 * h1.vz);
                const z2 = h2.z1 + (t2 * h2.vz);
                const h0 = { x1, x2, y1, y2, z1, z2 };
                if (hail.every((h) => {
                    return checkLineIntersection(h0, h);
                })) {
                    const dt = (t2 - t1);
                    const vx0 = (h0.x2 - h0.x1) / dt;
                    const x0 = h0.x1 - (t1 * vx0);
                    const vy0 = (h0.y2 - h0.y1) / dt;
                    const y0 = h0.y1 - (t1 * vy0);
                    const vz0 = (h0.z2 - h0.z1) / dt;
                    const z0 = h0.z1 - (t1 * vz0);
                    console.log(`${x0}, ${y0}, ${z0} @ ${vx0}, ${vy0}, ${vz0}`);
                    console.log(x0 + y0 + z0);
                    found = true;
                }
            }
        }
    }
}


console.log(`${hrTime() - start}µs`);