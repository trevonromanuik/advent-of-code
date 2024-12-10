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

const trailheads = [];
const map = input.replaceAll('\r', '').split('\n').map((line, y) => {
    return line.split('').map((n, x) => {
        if (n === '0') trailheads.push([y, x]);
        return parseInt(n)
    });
});

const sum = trailheads.reduce((sum, [sy, sx]) => {
    const q = [[sy, sx]];
    while (q.length) {
        const [y, x] = q.pop();
        const n = map[y][x];
        [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ].forEach(([dy, dx]) => {
            const ny = y + dy;
            const nx = x + dx;
            if (map[ny]?.[nx] === n + 1) {
                const k = `${ny},${nx}`;
                if (map[ny]?.[nx] === 9) {
                    sum++;
                } else {
                    q.push([ny, nx]);
                }
            }
        });
    }
    return sum;
}, 0);

console.log({ sum });
console.log(`${hrTime() - start}µs`);