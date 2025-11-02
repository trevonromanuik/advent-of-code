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

const [ivs_chunk, gates_chunk] = input.replaceAll('\r\n').split('\n\n');
const values = ivs_chunk.split('\n').reduce((values, line) => {
    const [k, v] = line.split(': ');
    values[k] = parseInt(v);
    return values;
}, {});

const zs = [];
const inputs_map = {};
const gates = gates_chunk.split('\n').map((line) => {
    const [input, output] = line.split(' -> ');
    if (output[0] === 'z') zs.push(output);
    const [l, op, r] = input.split(' ');
    const gate = [op, l, r, output];
    [l, r].forEach((x) => {
        if (!inputs_map[x]) inputs_map[x] = [];
        inputs_map[x].push(gate);
    });
    return gate;
});
zs.sort().reverse();
console.log(zs);

while (true) {
    // check if every z has a value
    if (zs.every((k) => {
        return values.hasOwnProperty(k);
    })) {
        const b = zs.map((k) => values[k]).join('');
        console.log(b, parseInt(b, 2));
        break;
    }

    // else iterate through all gates
    gates.forEach(([op, l, r, output]) => {
        if (values.hasOwnProperty(output)) return;
        if (values.hasOwnProperty(l) && values.hasOwnProperty(r)) {
            const lv = values[l];
            const rv = values[r];
            switch (op) {
                case 'AND':
                    values[output] = (lv && rv) ? 1 : 0;
                    break;
                case 'OR':
                    values[output] = (lv || rv) ? 1 : 0;
                    break;
                case 'XOR':
                    values[output] = ((lv || rv) && !(lv && rv)) ? 1 : 0;
                    break;
            }
        }
    });
}

console.log(`${hrTime() - start}µs`);