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

if (debug) {
    console.log('graph {');
    input.split('\n').forEach((line) => {
        const [l, r] = line.split(': ');
        console.log(`\t${l} -- { ${r} }`);
    });
    console.log('}');
}

const edges_to_trim = test ? [
    ['hfx', 'pzl'],
    ['bvb', 'cmg'],
    ['nvd', 'jqt'],
] : [
    ['tvj', 'cvx'],
    ['fsv', 'spx'],
    ['kdk', 'nct'],
];

const edges = {};
input.split('\n').forEach((line) => {
    const [l, r] = line.split(': ');
    if (!edges[l]) edges[l] = [];
    r.split(' ').forEach((r) => {
        if (!edges[r]) edges[r] = [];
        edges[l].push(r);
        edges[r].push(l);
    });
});
edges_to_trim.forEach(([l, r]) => {
    edges[l].splice(edges[l].indexOf(r), 1);
    edges[r].splice(edges[r].indexOf(l), 1);
});

// pick a random node and do a BFS count
const node_keys = Object.keys(edges);
const start_node = node_keys[0];
const seen = new Set([start_node]);
const q = [start_node];
while (q.length) {
    const k = q.pop();
    edges[k].forEach((e) => {
        if (!seen.has(e)) {
            seen.add(e);
            q.push(e);
        }
    });
}
console.log(seen.size, node_keys.length - seen.size, seen.size * (node_keys.length - seen.size));
console.log(`${hrTime() - start}µs`);