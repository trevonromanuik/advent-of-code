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

function makeKey(x, y, z, w) {
    return `${x},${y},${z},${w}`;
}

let map = {};
input.split('\n').forEach((line, y) => {
    line.split('').forEach((c, x) => {
        if(c === '#') map[makeKey(x, y, 0, 0)] = true;
    });
});

let cycles = 6;
for (let cycle = 0; cycle < cycles; cycle++) {
    let counts = {};
    Object.keys(map).forEach((coords) => {
        const [x, y, z, w] = coords.split(',').map(n => parseInt(n));
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                for(let k = -1; k <= 1; k++) {
                    for(let l = -1; l <= 1; l++) {
                        if([i, j, k, l].every(n => n === 0)) continue;
                        const key = makeKey(x + i, y + j, z + k, w + l);
                        if(!counts[key]) counts[key] = 1; else counts[key] += 1;
                    }
                }
            }
        }
    });
    let new_map = {};
    Object.keys(counts).forEach((coords) => {
        if(map[coords]) {
            if(counts[coords] === 2 || counts[coords] === 3) {
                new_map[coords] = true;
            }
        } else {
            if(counts[coords] === 3) {
                new_map[coords] = true;
            }
        }
    });
    map = new_map;
}
console.log('-----');
console.log(Object.keys(map).length);

console.log(`${hrTime() - start}µs`);