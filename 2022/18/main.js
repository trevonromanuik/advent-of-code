const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const points = input.split('\n').map((line) => {
    return line.split(',').map((n) => parseInt(n));
});

let min_x = Infinity, min_y = Infinity, min_z = Infinity;
let max_x = -Infinity, max_y = -Infinity, max_z = -Infinity;
const map = {};
points.forEach(([x, y, z]) => {
    if(!map[x]) map[x] = {};
    if(!map[x][y]) map[x][y] = {};
    if(!map[x][y][z]) map[x][y][z] = true;
    if(x < min_x) min_x = x;
    if(x > max_x) max_x = x;
    if(y < min_y) min_y = y;
    if(y > max_y) max_y = y;
    if(z < min_z) min_z = z;
    if(z > max_z) max_z = z;
});
min_x -= 1;
max_x += 1;
min_y -= 1;
max_y += 1;
min_z -= 1;
max_z += 1;

const seen = { [[min_x, min_y, min_z]]: true };
const queue = [[min_x, min_y, min_z]];
while(queue.length) {
    const [x, y, z] = queue.pop();
    [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
    ].forEach(([dx, dy, dz]) => {
        const nx = x + dx;
        if(dx && (nx < min_x || nx > max_x)) return;
        const ny = y + dy;
        if(dy && (ny < min_y || ny > max_y)) return;
        const nz = z + dz;
        if(dz && (nz < min_z || nz > max_z)) return;
        if(!seen[[nx, ny, nz]] && !isPoint(map, [nx, ny, nz])) {
            seen[[nx, ny, nz]] = true;
            queue.push([nx, ny, nz]);
        }
    });
}

const part1 = points.reduce((acc, [x, y, z]) => {
    [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
    ].forEach(([dx, dy, dz]) => {
        if(!isPoint(map, [x + dx, y + dy, z + dz])) acc += 1;
    });
    return acc;
}, 0);

console.log(`part 1: ${part1}`);

const part2 = points.reduce((acc, [x, y, z]) => {
    [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
    ].forEach(([dx, dy, dz]) => {
        if(seen[[x + dx, y + dy, z + dz]]) acc += 1;
    });
    return acc;
}, 0);

console.log(`part 2: ${part2}`);

function isPoint(map, [x, y, z]) {
    if(!map[x]) return false;
    if(!map[x][y]) return false;
    if(!map[x][y][z]) return false;
    return true;
}