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

let price = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x][1]) continue;
        const c = map[y][x][0];
        let area = 0;
        let perimeter = 0;
        map[y][x][1] = true;
        const q = [[y, x]];
        while (q.length) {
            area++;
            const [y, x] = q.shift();
            [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ].forEach(([dy, dx]) => {
                const ny = y + dy;
                const nx = x + dx;
                if (map[ny]?.[nx]?.[0] === c) {
                    if (!map[ny][nx][1]) {
                        map[ny][nx][1] = true;
                        q.push([ny, nx]);
                    }
                } else {
                    perimeter++;
                }
            });
        }
        if (debug) console.log({ c, area, perimeter, price: area * perimeter })
        price += area * perimeter;
    }
}

console.log({ price });
console.log(`${hrTime() - start}µs`);