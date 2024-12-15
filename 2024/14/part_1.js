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

const [w, h] = test ? [11, 7] : [101, 103];
const w2 = Math.floor(w / 2);
const h2 = Math.floor(h / 2);
const r = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;
const steps = 100;
const score = input.replaceAll('\r', '').split('\n').reduce((quadrants, line) => {
    let [, px, py, vx, vy] = r.exec(line);
    let x = (parseInt(px) + (steps * parseInt(vx))) % w;
    if (x < 0) x += w;
    let y = (parseInt(py) + (steps * parseInt(vy))) % h;
    if (y < 0) y += h;
    if (x < w2) {
        if (y < h2) {
            quadrants[0]++;
        } else if (y > h2) {
            quadrants[2]++;
        }
    } else if (x > w2) {
        if (y < h2) {
            quadrants[1]++;
        } else if (y > h2) {
            quadrants[3]++;
        }
    }
    return quadrants;
}, [0, 0, 0, 0]).reduce((p, n) => {
    return p * n;
});

console.log({ score });
console.log(`${hrTime() - start}µs`);