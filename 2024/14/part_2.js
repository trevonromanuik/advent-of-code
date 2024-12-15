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
const r = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;
const map = new Array(h).fill(null).map(() => new Array(w).fill(0));
const robots = input.replaceAll('\r', '').split('\n').map((line) => {
    const [, px, py, vx, vy] = r.exec(line);
    map[parseInt(py)][parseInt(px)]++;
    return {
        x: parseInt(px),
        y: parseInt(py),
        vx: parseInt(vx),
        vy: parseInt(vy),
    };
});

let done = false;
let steps = 0;
while (!done) {
    steps++;
    robots.forEach((robot) => {
        map[robot.y][robot.x]--;
        robot.x = (robot.x + robot.vx) % w;
        if (robot.x < 0) robot.x += w;
        robot.y = (robot.y + robot.vy) % h;
        if (robot.y < 0) robot.y += h;
        map[robot.y][robot.x]++;
    });
    robots.forEach(({ x, y }) => {
        if (done) return;
        for (let i = 0; i < 4; i++) {
            for (let j = -i; j <= i; j++) {
                if (!map[y + i]?.[x + j]) return;
            }
        }
        done = true;
        if (debug) {
            console.log('===========');
            console.log(`step: ${steps}`);
            console.log(map.map((row) => {
                return row.map((n) => {
                    return n === 0 ? '.' : n;
                }).join('');
            }).join('\n'));
            console.log('===========');
        }
    });
}

console.log({ steps });
console.log(`${hrTime() - start}µs`);