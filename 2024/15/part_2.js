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
    return line.split('').flatMap((c, j) => {
        switch (c) {
            case '#':
                return ['#', '#'];
            case 'O':
                return ['[', ']'];
            case '.':
                return ['.', '.'];
            case '@':
                y = i;
                x = j * 2;
                return ['.', '.'];
        }
    });
});

moves_chunk.split('\n').join('').split('').forEach((c) => {
    const [dy, dx] = {
        '^': [-1, 0],
        'v': [1, 0],
        '<': [0, -1],
        '>': [0, 1],
    }[c];
    let ny = y + dy;
    let nx = x + dx;
    if (map[ny][nx] === '.') {
        y = ny;
        x = nx;
    } else if (map[ny][nx] === '[' || map[ny][nx] === ']') {
        const q = [[y, x]];
        const seen = new Set([`${y},${x}`]);
        let can_move = true;
        for (let i = 0; i < q.length; i++) {
            const [y, x] = q[i];
            if (map[y][x] === '.' && i > 0) {
                continue;
            }
            if (map[y][x] === '#') {
                can_move = false;
                break;
            }
            switch (c) {
                case '^': {
                    q.push([y - 1, x]);
                    seen.add(`${y - 1},${x}`);
                    switch (map[y - 1][x]) {
                        case '[': {
                            q.push([y - 1, x + 1]);
                            seen.add(`${y - 1},${x + 1}`);
                            break;
                        }
                        case ']': {
                            q.push([y - 1, x - 1]);
                            seen.add(`${y - 1},${x - 1}`);
                            break;
                        }
                    }
                    break;
                }
                case 'v': {
                    q.push([y + 1, x]);
                    seen.add(`${y + 1},${x}`);
                    switch (map[y + 1][x]) {
                        case '[': {
                            q.push([y + 1, x + 1]);
                            seen.add(`${y + 1},${x + 1}`);
                            break;
                        }
                        case ']': {
                            q.push([y + 1, x - 1]);
                            seen.add(`${y + 1},${x - 1}`);
                            break;
                        }
                    }
                    break;
                }
                case '<': {
                    q.push([y, x - 1]);
                    seen.add(`${y},${x - 1}`);
                    break;
                }
                case '>': {
                    q.push([y, x + 1]);
                    seen.add(`${y},${x + 1}`);
                    break;
                }
            }
        }
        if (can_move) {
            for (let i = q.length - 1; i >= 0; i--) {
                const [y, x] = q[i];
                map[y][x] = seen.has(`${y - dy},${x - dx}`) ?
                    map[y - dy][x - dx] : '.';
            }
            y = ny;
            x = nx;
        }
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
        if (map[i][j] === '[') {
            sum += (100 * i) + j;
        }
    }
}

console.log({ sum });
console.log(`${hrTime() - start}µs`);