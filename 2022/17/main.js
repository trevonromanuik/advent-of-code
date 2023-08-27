const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const shapes = [
    [
        [1, 1, 1, 1],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    [
        [0, 0, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    [
        [1],
        [1],
        [1],
        [1],
    ],
    [
        [1, 1],
        [1, 1],
    ],
];

const DEBUG = false;
const MAP_WIDTH = 7;

console.log(`part 1: ${solve(2022)}`);
console.log(`part 2: ${solve(1000000000000)}`);

function solve(n_rocks) {
    const map = [];
    const states = {};
    let cycle_bump = 0;
    let max_row = -1;
    let char_index = -1;
    for(let i = 0; i < n_rocks; i++) {

        // if(i % 100000 === 0) console.log(`${i}`);

        const shape_index = i % shapes.length;
        const shape = shapes[shape_index];
        // const shape = shapes[2];

        let x = 2;
        let y = max_row + 3 + shape.length;

        // add extra rows to fit the new shape
        for(let j = map.length; j <= y; j++) {
            map.push(new Array(MAP_WIDTH).fill(0));
        }

        if(DEBUG) console.log(`rock ${i}`);
        if(DEBUG) print(map, x, y, shape);

        while(true) {
            char_index = (char_index + 1) % input.length;
            switch(input[char_index]) {
                case '<': {
                    let can_move = x - 1 >= 0;
                    if(can_move) {
                        for(let i = 0; i < shape.length; i++) {
                            for(let j = 0; j < shape[i].length; j++) {
                                if(shape[i][j]) {
                                    if(map[y - i][x + j - 1]) {
                                        can_move = false;
                                        break;
                                    }
                                }
                            }
                            if(!can_move) break;
                        }
                    }
                    if(can_move) {
                        if(DEBUG) console.log(`moving left`);
                        x -= 1;
                    } else {
                        if(DEBUG) console.log(`can't move left`);
                    }
                    break;
                }
                case '>': {
                    let can_move = x + shape[0].length < MAP_WIDTH;
                    if(can_move) {
                        for(let i = 0; i < shape.length; i++) {
                            for(let j = shape[i].length - 1; j >= 0; j--) {
                                if(shape[i][shape[i].length - j - 1]) {
                                    if(map[y - i][x + shape[i].length - j]) {
                                        can_move = false;
                                        break;
                                    }
                                }
                            }
                            if(!can_move) break;
                        }
                    }
                    if(can_move) {
                        if(DEBUG) console.log(`moving right`);
                        x += 1;
                    } else {
                        if(DEBUG) console.log(`can't move right`);
                    }
                    break;
                }
            }
            if(DEBUG) print(map, x, y, shape);
            let can_move = (y - shape.length) > -1;
            if(can_move) {
                for(let j = 0; j < shape[0].length; j++) {
                    for(let i = shape.length - 1; i >= 0; i--) {
                        if(shape[i][j]) {
                            if(map[y - i - 1][x + j]) {
                                can_move = false;
                                break;
                            }
                        }
                    }
                    if(!can_move) break;
                }
            }
            if(can_move) {
                if(DEBUG) console.log(`moving down`);
                y -= 1;
                if(DEBUG) print(map, x, y, shape);
            } else {
                if(DEBUG) console.log(`rock bottom`);
                for(let i = 0; i < shape.length; i++) {
                    for(let j = 0; j < shape[i].length; j++) {
                        if(shape[i][j]) {
                            map[y - i][x + j] = 1;
                        }
                    }
                }
                if(DEBUG) print(map);
                const max_cols = new Array(MAP_WIDTH).fill(-1);
                for(let j = 0; j < MAP_WIDTH; j++) {
                    for(let i = map.length - 1; i >= 0; i--) {
                        if(map[i][j]) {
                            if(i > max_row) max_row = i;
                            max_cols[j] = i;
                            break;
                        }
                    }
                }
                const min_row = Math.min(...max_cols);
                const rel_cols = max_cols.map(n => n - min_row);
                // console.log(max_cols, min_row, rel_cols);
                const state_key = `${rel_cols}:${shape_index}:${char_index}`;
                if(states[state_key]) {
                    // console.log(`found duplicate state: ${state_key}`);
                    const prev_state = states[state_key];
                    const cycle_length = i - prev_state.i;
                    const cycle_height = max_row - prev_state.max_row;
                    const n_cycles = Math.floor((n_rocks - 1 - i) / cycle_length);
                    cycle_bump += (n_cycles * cycle_height);
                    i += (n_cycles * cycle_length);
                } else {
                    states[state_key] = { i, max_row };
                }

                if(DEBUG) console.log('=========');
                break;
            }

        }

    }
    return max_row + 1 + cycle_bump;
}

function print(map, x, y, shape) {
    const lines = map.map((row) => {
        return row.map((i) => {
            return i ? '#' : '.';
        });
    })
    if(shape) {
        for(let i = 0; i < shape.length; i++) {
            for(let j = 0; j < shape[i].length; j++) {
                if(shape[i][j]) {
                    lines[y - i][x + j] = '@';
                }
            }
        }
    }
    lines.reverse();
    lines.forEach((line) => {
        console.log(`|${line.join('')}|`);
    });
    console.log(`+-------+`);
    console.log();
}