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

const [map_chunk, moves_chunk] = input.replaceAll('\r', '').split('\n\n');

let y, x;
const map = map_chunk.split('\n').map((line, i) => {
    return line.split('').map((c, j) => {
        if (c === '@') {
            y = i;
            x = j;
            return '.';
        }
        return c;
    });
});

moves_chunk.split('\n').join('').split('').forEach((c) => {
    const [dy, dx] = {
        '^': [-1, 0],
        'v': [1, 0],
        '<': [0, -1],
        '>': [0, 1],
    }[c];
    let ny = y;
    let nx = x;
    do {
        ny += dy;
        nx += dx;
    } while (map[ny][nx] !== '.' && map[ny][nx] !== '#')
    if (map[ny][nx] === '.') {
        if (map[y + dy][x + dx] === 'O') {
            map[y + dy][x + dx] = '.';
            map[ny][nx] = 'O';
        }
        y += dy;
        x += dx;
    }
    if (debug) {
        console.log(`Move ${c}`);
        console.log(map.map((row, i) => {
            return row.map((c, j) => {
                if (i === y && j === x) return '@';
                return c;
            }).join('');
        }).join('\n'));
        console.log('');
    }
});

let sum = 0;
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 'O') {
            sum += (100 * i) + j;
        }
    }
}

console.log({ sum });
console.log(`${hrTime() - start}µs`);