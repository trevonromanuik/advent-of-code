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

const gates = input.replaceAll('\r', '').split('\n').reduce((gates, line) => {
    const [l, g] = line.split(' -> ');
    gates[g] = { op: l.split(' '), v: null };
    return gates;
}, {});

const gate_keys = new Set(Object.keys(gates));
gates['b'].v = 46065;
gate_keys.delete('b');

while (gate_keys.size) {
    [...gate_keys].forEach((g) => {
        const gate = gates[g];
        const { op } = gate;
        if (op.length === 1) {
            const lv = gates[op[0]]?.v ?? parseInt(op[0]);
            if (isNaN(lv)) return;
            gate.v = lv;
        } else if (op.length === 2) {
            if (op[0] === 'NOT') {
                if (gates[op[1]].v === null) return;
                gate.v = ~gates[op[1]].v;
            } else {
                throw new Error(`unknown op: ${op}`);
            }
        } else if (op.length === 3) {
            const lv = gates[op[0]]?.v ?? parseInt(op[0]);
            const rv = gates[op[2]]?.v ?? parseInt(op[2]);
            if (isNaN(lv) || isNaN(rv)) return;
            if (op[1] === 'AND') {
                gate.v = lv & rv;
            } else if (op[1] === 'OR') {
                gate.v = lv | rv;
            } else if (op[1] === 'LSHIFT') {
                gate.v = lv << rv;
            } else if (op[1] === 'RSHIFT') {
                gate.v = lv >> rv;
            }
        }
        if (gate.v < 0) gate.v += 65536;
        gate_keys.delete(g);
    });
}

Object.keys(gates).sort().forEach((g) => {
    console.log(g, gates[g].v);
});
console.log('a', gates['a'].v);

console.log(`${hrTime() - start}µs`);