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

const distances = input.replaceAll('\r', '').split('\n').reduce((distances, line) => {
    const [from, , to, , d] = line.split(' ');
    const distance = parseInt(d);
    if (!distances[from]) distances[from] = {};
    distances[from][to] = distance;
    if (!distances[to]) distances[to] = {};
    distances[to][from] = distance;
    return distances;
}, {});

let min_distance = Infinity;
let min_path = null;
function travel(from, tos, path, cost) {
    path = [...path, from];
    if (tos.size === 0) {
        console.log(JSON.stringify(path), cost);
        if (cost < min_distance) {
            min_distance = cost;
            min_path = path;
        }
    } else {
        tos.forEach((to) => {
            const new_tos = new Set(tos);
            new_tos.delete(to);
            travel(to, new_tos, path, cost + distances[from][to]);
        });
    }
}

Object.keys(distances).forEach((from) => {
    const tos = new Set(Object.keys(distances));
    tos.delete(from);
    travel(from, tos, [], 0);
});
console.log('-----');
console.log(JSON.stringify(min_path), min_distance);

console.log(`${hrTime() - start}µs`);