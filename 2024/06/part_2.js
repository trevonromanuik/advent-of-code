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

let start_y, start_x;
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
let dir = 0;
const seen = new Set();
const map = input.replaceAll('\r', '').split('\n').map((line, i) => {
    return line.split('').map((c, j) => {
        if (c === '^') {
            start_y = i;
            start_x = j;
            c = '.';
        }
        return c;
    });
});
const h = map.length;
const w = map[0].length;

let y = start_y;
let x = start_x;
let steps = new Set()
while (y >= 0 && y < h && x >= 0 && x < w) {
    const ny = y + dirs[dir][0];
    const nx = x + dirs[dir][1];
    if (map[ny]?.[nx] === '#') {
        dir = ++dir % dirs.length;
    } else {
        steps.add(`${x},${y}`);
        y = ny;
        x = nx;
    }
}

steps = Array.from(steps);
let count = 0;
for (let i = 1; i < steps.length; i++) {
    // console.log({ i });
    const [sx, sy] = steps[i].split(',').map(n => parseInt(n));
    map[sy][sx] = '#';
    y = start_y;
    x = start_x;
    dir = 0;
    const seen = new Set();
    while (y >= 0 && y < h && x >= 0 && x < w) {
        const key = `${x},${y},${dir}`;
        if (seen.has(key)) {
            if (debug) console.log({ sy, sx });
            count++;
            break;
        }
        seen.add(key);
        const ny = y + dirs[dir][0];
        const nx = x + dirs[dir][1];
        if (map[ny]?.[nx] === '#') {
            dir = ++dir % dirs.length;
        } else {
            y = ny;
            x = nx;
        }
    }
    map[sy][sx] = '.';
}

// let count = 0;
// let i = 0;
// while (y >= 0 && y < h && x >= 0 && x < w) {
//     console.log('i', ++i);
//     const ny = y + dirs[dir][0];
//     const nx = x + dirs[dir][1];
//     if (map[ny]?.[nx] === '#') {
//         dir = (dir + 1) % dirs.length;
//     } else {
//         if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
//             // first try putting an obstacle at [ny][nx] and see if we loop
//             map[ny][nx] = '#';
//             let y2 = y;
//             let x2 = x;
//             let dir2 = (dir + 1) % dirs.length;
//             while (y2 >= 0 && y2 < h && x2 >= 0 && x2 < w) {
//                 if (debug) console.log(y2, x2, dir2);
//                 if (y2 === y && x2 === x && dir2 === dir) {
//                     if (debug) console.log([ny, nx]);
//                     count++;
//                     break;
//                 }
//                 const ny2 = y2 + dirs[dir2][0];
//                 const nx2 = x2 + dirs[dir2][1];
//                 if (map[ny2]?.[nx2] === '#') {
//                     dir2 = (dir2 + 1) % dirs.length;
//                 } else {
//                     y2 = ny2;
//                     x2 = nx2;
//                 }
//             }
//             map[ny][nx] = '.';
//         }
//         y = ny;
//         x = nx;
//         break;
//     }
// }

console.log(count);

console.log(`${hrTime() - start}µs`);