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

const bricks = input.split('\n').map((line, i) => {
    const [[x1, y1, z1], [x2, y2, z2]] = line.split('~').map((s) => {
        return s.split(',').map(n => parseInt(n));
    });
    return { i, x1, x2, y1, y2, z1, z2, supports: [], supported_by: [] };
});

bricks.sort((a, b) => {
    return a.z1 < b.z1 ? -1 : 1;
});

function intersects(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) {
    return !(ax2 < bx1 || ax1 > bx2 || ay2 < by1 || ay1 > by2);
}

for (let i = 0; i < bricks.length; i++) {
    const b1 = bricks[i];
    let supported = false
    while (b1.z1 > 1 && !supported) {
        const z = b1.z1 - 1;
        for (let j = i - 1; j >= 0; j--) {
            const b2 = bricks[j];
            if (z !== b2.z2) continue;
            if (intersects(b1.x1, b1.x2, b1.y1, b1.y2, b2.x1, b2.x2, b2.y1, b2.y2)) {
                supported = true;
                b2.supports.push(i);
                b1.supported_by.push(j);
            }
        }
        if (!supported) {
            b1.z1--;
            b1.z2--;
        }
    }
}
const count = bricks.reduce((count, { i, supports, supported_by }) => {
    if (supports.every((n) => {
        return bricks[n].supported_by.length > 1;
    })) {
        count++;
    }
    return count;
}, 0);
console.log(count);
console.log(`${hrTime() - start}µs`);