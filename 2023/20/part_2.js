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

const modules = input.split('\n').reduce((modules, line) => {
    const [l, r] = line.split(' -> ');
    const [type, key] = l === 'broadcaster' ?
        ['=', l] : [l[0], l.substring(1)];
    const outs = r.split(', ');
    const state = type === '%' ? false : {};
    modules[key] = { type, key, outs, state };
    return modules;
}, {});

// initialize conjunction modules
Object.values(modules).forEach((module) => {
    if (module.type === '&') {
        Object.values(modules).forEach((m) => {
            if (m.key === module.key) return;
            if (!m.outs.includes(module.key)) return;
            module.state[m.key] = false;
        });
    }
});

let done = false;
let steps = 0;
while (!done) {
    steps++;
    if (steps % 1000000 === 0) console.log(steps, `${hrTime() - start}µs`);
    const q = [[false, 'broadcaster', 'rf']];
    while (q.length) {
        const [signal, from, to] = q.shift();
        if (debug) console.log(from, signal, to);
        if (to === 'tg' && signal) {
            done = true;
            break;
        }
        const module = modules[to];
        if (!module) continue;
        switch(module.type) {
            case '=':
                module.outs.forEach((out) => {
                    q.push([signal, module.key, out]);
                });
                break;
            case '%':
                if(!signal) {
                    module.state = !module.state;
                    module.outs.forEach((out) => {
                        q.push([module.state, module.key, out]);
                    });
                }
                break;
            case '&':
                module.state[from] = signal;
                const out_signal = !Object.values(module.state).every(b => b);
                module.outs.forEach((out) => {
                    q.push([out_signal, module.key, out]);
                });
                break;
        }
    }
}
console.log(steps);
console.log(`${hrTime() - start}µs`);