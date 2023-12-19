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

const chunks = input.split('\n\n');
const workflows = chunks[0].split('\n').reduce((workflows, line) => {
    const [key, r] = line.split('{');
    workflows[key] = r.substring(0, r.length - 1).split(',').map((step) => {
        const [l, r] = step.split(':');
        if (!r) {
            return {
                o: '=',
                r: l,
            };
        } else {
            return {
                k: l[0],
                o: l[1],
                v: parseInt(l.substring(2)),
                r: r,
            };
        }
    });
    return workflows;
}, {});

function solve(part, workflow, step) {
    if (debug) console.log(part, workflow, step);
    if (workflow === 'R') {
        if (debug) console.log('', 'reject', 0);
        return 0;
    }
    if (workflow === 'A') {
        const p = Object.values(part).reduce((p, [min, max]) => {
            return p * (max - min + 1);
        }, 1);
        if (debug) console.log('', 'approve', p);
        return p;
    }
    const { k, o, v, r } = workflows[workflow][step];
    if (debug) console.log('', { k, o, v, r });
    if (k) {
        const [min_v, max_v] = part[k];
        if (v < min_v || v > max_v) return 0;
        switch (o) {
            case '<':
                return solve({
                    ...part,
                    [k]: [min_v, v - 1],
                }, r, 0) + solve({
                    ...part,
                    [k]: [v, max_v],
                }, workflow, step + 1);
            case '>':
                return solve({
                    ...part,
                    [k]: [v + 1, max_v],
                }, r, 0) + solve({
                    ...part,
                    [k]: [min_v, v],
                }, workflow, step + 1);
        }
    } else {
        return solve(part, r, 0);
    }
}
const p = solve({
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
}, 'in', 0);
console.log(p);
console.log(`${hrTime() - start}µs`);