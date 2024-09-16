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

let black_tiles = new Set();
input.replaceAll('\r', '').split('\n').forEach((line) => {
    let x = 0, y = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 'e') {
            x++;
        } else if (line[i] === 's') {
            y--;
            if (line[++i] == 'e') x++;
        } else if (line[i] === 'w') {
            x--;
        } else if (line[i] === 'n') {
            y++;
            if (line[++i] === 'w') x--;
        }
    }
    const k = `${x},${y}`;
    if (black_tiles.has(k)) {
        black_tiles.delete(k);
    } else {
        black_tiles.add(k);
    }
});

const n_days = 100;
for (let day = 0; day < n_days; day++) {
    // console.log([...black_tiles].sort().join(' '));
    const tiles_to_check = new Set([...black_tiles]);
    const deltas = [[0, 1], [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1]];
    black_tiles.forEach((k) => {
        const [x, y] = k.split(',').map((n) => parseInt(n));
        deltas.forEach(([dx, dy]) => {
            tiles_to_check.add(`${x + dx},${y + dy}`);
        });
    });
    const new_black_tiles = new Set();
    tiles_to_check.forEach((k) => {
        const [x, y] = k.split(',').map((n) => parseInt(n));
        const nc = deltas.filter(([dx, dy]) => {
            return black_tiles.has(`${x + dx},${y + dy}`);
        }).length;
        if (nc === 2 || (nc === 1 && black_tiles.has(k))) {
            new_black_tiles.add(k);
        }
    });
    black_tiles = new_black_tiles;
    console.log(`Day ${day + 1}: ${black_tiles.size}`);
    // const tiles_to_check = [...black_tiles].map((k) => {
    //     const [x, y] = k.split(',').map((n) => parseInt(n));
    //     return { k, x, y };
    // });
    // const tiles_to_flip = new Set();
    // const seen_tiles = new Set(black_tiles);
    // let black_to_white = 0;
    // let white_to_black = 0;
    // while (tiles_to_check.length) {
    //     const { k, x, y } = tiles_to_check.shift();
    //     const deltas = [[0, 1], [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1]];
    //     const is_black = black_tiles.has(k);
    //     const adjacent_tiles = deltas.map(([dx, dy]) => {
    //         const nx = x + dx;
    //         const ny = y + dy;
    //         const nk = `${nx},${ny}`;
    //         if (is_black && !seen_tiles.has(nk)) {
    //             tiles_to_check.push({ k: nk, x: nx, y: ny });
    //             seen_tiles.add(nk);
    //         }
    //         return nk;
    //     }).filter((nk) => {
    //         return black_tiles.has(nk);
    //     });
    //     const adjacent_count = adjacent_tiles.length;
    //     if (is_black) {
    //         // console.log(`${k} is black and has ${adjacent_count} black neighbours: ${adjacent_tiles.join(' ')}`);
    //         if (adjacent_count === 0 || adjacent_count > 2) {
    //             tiles_to_flip.add(k);
    //             black_to_white++;
    //         }
    //     } else {
    //         // console.log(`${k} is white and has ${adjacent_count} black neighbours: ${adjacent_tiles.join(' ')}`);
    //         if (adjacent_count === 2) {
    //             tiles_to_flip.add(k);
    //             white_to_black++;
    //         }
    //     }
    // }
    // console.log(black_tiles.size, black_to_white, white_to_black, black_tiles.size - black_to_white + white_to_black);
    // tiles_to_flip.forEach((k) => {
    //     if (black_tiles.has(k)) {
    //         black_tiles.delete(k);
    //     } else {
    //         black_tiles.add(k);
    //     }
    // });
    // console.log(`Day ${day + 1}: ${black_tiles.size}`);
}

console.log({ count: black_tiles.size });
console.log(`${hrTime() - start}µs`);