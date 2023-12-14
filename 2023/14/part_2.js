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

const map = input.split('\n').map((line) => {
    return line.split('');
});
const n_rows = map.length;
const n_cols = map[0].length;

function draw(map) {
    return map.map((row) => {
        return row.join('');
    }).join('\n')
}

const MAX_STEPS = 1000000000;
const cache = {};
const maps = new Array(10000);
let loop = null;
for (let step = 0; step < MAX_STEPS; step++) {

    const key = draw(map);

    if (debug) console.log('------');
    if (debug) console.log(step);
    if (debug) console.log(key);

    if (key in cache) {
        loop = [cache[key], step];
        if (debug) console.log(`found loop! ${loop[0]} -> ${loop[1]}`);
        break;
    }
    cache[key] = step;
    maps[step] = key;

    // north
    for (let i = 0; i < n_cols; i++) {
        let last_j = -1;
        for (let j = 0; j < n_rows; j++) {
            switch (map[j][i]) {
                case '.':
                    break;
                case 'O':
                    last_j++;
                    map[j][i] = '.';
                    map[last_j][i] = 'O';
                    break;
                case '#':
                    last_j = j;
                    break;
            }
        }
    }

    if (debug) console.log('N');
    if (debug) console.log(draw(map));

    // west
    for (let j = 0; j < n_rows; j++) {
        let last_i = -1;
        for (let i = 0; i < n_cols; i++) {
            switch (map[j][i]) {
                case '.':
                    break;
                case 'O':
                    last_i++;
                    map[j][i] = '.';
                    map[j][last_i] = 'O';
                    break;
                case '#':
                    last_i = i;
                    break;
            }
        }
    }

    if (debug) console.log('W');
    if (debug) console.log(draw(map));

    // south
    for (let i = n_cols - 1; i >= 0; i--) {
        let last_j = n_rows;
        for (let j = n_rows - 1; j >= 0; j--) {
            switch (map[j][i]) {
                case '.':
                    break;
                case 'O':
                    last_j--;
                    map[j][i] = '.';
                    map[last_j][i] = 'O';
                    break;
                case '#':
                    last_j = j;
                    break;
            }
        }
    }

    if (debug) console.log('S');
    if (debug) console.log(draw(map));

    // east
    for (let j = n_rows - 1; j >= 0; j--) {
        let last_i = n_cols;
        for (let i = n_cols - 1; i >= 0; i--) {
            switch (map[j][i]) {
                case '.':
                    break;
                case 'O':
                    last_i--;
                    map[j][i] = '.';
                    map[j][last_i] = 'O';
                    break;
                case '#':
                    last_i = i;
                    break;
            }
        }
    }

    if (debug) console.log('E');
    if (debug) console.log(draw(map));
}

const s = maps[(MAX_STEPS - loop[0]) % (loop[1] - loop[0]) + loop[0]];
const sum = s.split('\n').reduce((sum, line, i) => {
    const n = n_rows - i;
    for (let j = 0; j < line.length; j++) {
        if (line[j] === 'O') sum += n;
    }
    return sum;
}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);