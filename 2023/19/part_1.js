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

const sum = chunks[1].split('\n').reduce((sum, line, line_num) => {
    const part = line.substring(1, line.length - 1).split(',').reduce((part, line) => {
        const [k, v] = line.split('=');
        part[k] = parseInt(v);
        return part;
    }, {});
    let done = false;
    let steps = workflows['in'];
    while (!done) {
        for (let i = 0; i < steps.length; i++) {
            const { k, o, v, r } = steps[i];
            let b = false;
            switch (o) {
                case '=':
                    b = true;
                    break;
                case '<':
                    b = part[k] < v;
                    break;
                case '>':
                    b = part[k] > v;
                    break;
            }
            if (b) {
                switch (r) {
                    case 'A':
                        done = true;
                        const n = Object.values(part).reduce((sum, n) => sum + n);
                        if (debug) console.log(`${line_num}: approved ${n}`);
                        sum += n;
                        break;
                    case 'R':
                        done = true;
                        if (debug) console.log(`${line_num}: rejected`);
                        break;
                    default:
                        if (debug) console.log(`${line_num}: sending to ${r}`);
                        steps = workflows[r];
                        break;
                }
                break;
            }
        }
    }
    return sum;
}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);