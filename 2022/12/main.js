const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

let start, end;
const map = input.split('\n').map((line, i) => {
    return line.split('').map((c, j) => {
        switch(c) {
            case 'S': {
                start = [j, i];
                return 1;
            }
            case 'E': {
                end = [j, i];
                return 26;
            }
            default: {
                return c.charCodeAt(0) - 96;
            }
        }
    });
});

const h = map.length;
const w = map[0].length;
const queue = [start];
const steps = { [start]: 0 };
const seen = {};
const prevs = {};

while(queue.length) {
    queue.sort((a, b) => { return steps[a] - steps[b]; });
    // console.log('');
    // queue.forEach((n) => console.log(`${n}: ${steps[n]}`));
    // console.log('');
    const [x1, y1] = queue.shift();
    const n_steps = steps[[x1, y1]];
    if(seen[[x1, y1]]) {
        console.error(`seen ${[x1, y1]} before`);
        break;
    }
    seen[[x1, y1]] = true;
    console.log(`visiting ${[x1, y1]}: ${n_steps}`);
    if(x1 === end[0] && y1 === end[1]) {
        console.log('found the end!');
        break;
    }
    [
        [x1 - 1, y1],
        [x1 + 1, y1],
        [x1, y1 - 1],
        [x1, y1 + 1],
    ].forEach(([x2, y2]) => {
        if(x2 < 0) return;
        if(x2 >= w) return;
        if(y2 < 0) return;
        if(y2 >= h) return;
        if(map[y2][x2] - map[y1][x1] < 2) {
            if(steps[[x2, y2]] === undefined || n_steps + 1 < steps[[x2, y2]]) {
                // console.log(`pushing ${[x2, y2]}: ${n_steps + 1} (prev ${steps[[x2, y2]]})`);
                steps[[x2, y2]] = n_steps + 1;
                prevs[[x2, y2]] = [x1, y1];
                queue.push([x2, y2]);
            }
        }
    });
}
console.log(`part 1: ${steps[end]}`);
const p = [[end, map[end[1]][end[0]]]];
let node = end;
while(prevs[node]) {
    node = prevs[node];
    p.push([node, map[node[1]][node[0]]]);
}
p.reverse();
console.log(p);