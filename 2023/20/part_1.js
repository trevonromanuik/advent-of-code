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

const MAX_STEPS = 1000;
let low_pulses = 0;
let high_pulses = 0;
for (let i = 0; i < MAX_STEPS; i++) {
    const q = [[false, 'button', 'broadcaster']];
    while (q.length) {
        const [signal, from, to] = q.shift();
        if (debug) console.log(from, signal, to);
        signal ? high_pulses++ : low_pulses++;
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
console.log(low_pulses, high_pulses, low_pulses * high_pulses);
console.log(`${hrTime() - start}µs`);