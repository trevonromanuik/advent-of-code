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

const map = input.replaceAll('\r', '').split('\n').map((line) => {
    return line.split('').map((c) => {
        return [c, false];
    });
});

const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
];

let price = 0;
for (let sy = 0; sy < map.length; sy++) {
    for (let sx = 0; sx < map[sy].length; sx++) {
        if (map[sy][sx][1]) continue;
        const c = map[sy][sx][0];
        let area = 0;
        let sides = 0;
        map[sy][sx][1] = true;
        const q = [[sy, sx]];
        while (q.length) {
            area++;
            const [y, x] = q.shift();
            for (let i = 0; i < dirs.length; i++) {
                const [dy, dx] = dirs[i];
                const [dy2, dx2] = dirs[(i + 1) % dirs.length];
                const ny = y + dy;
                const nx = x + dx;
                if (map[ny]?.[nx]?.[0] === c) {
                    if (!map[ny][nx][1]) {
                        map[ny][nx][1] = true;
                        q.push([ny, nx]);
                    }
                    // check for convex corner
                    if (map[y + dy2]?.[x + dx2]?.[0] === c) {
                        if (map[y + dy + dy2]?.[x + dx + dx2]?.[0] !== c) {
                            sides++;
                        }
                    }
                } else {
                    // check for concave corner
                    if (map[y + dy2]?.[x + dx2]?.[0] !== c) {
                        sides++;
                    }
                }
            }
        }
        if (debug) console.log({ c, area, sides, price: area * sides })
        price += area * sides;
    }
}

console.log({ price });
console.log(`${hrTime() - start}µs`);