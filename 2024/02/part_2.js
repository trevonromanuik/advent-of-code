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

function isSafe(ns) {
    let safe = true;
    const dir = (ns[1] - ns[0]) / Math.abs(ns[1] - ns[0]);
    for (let i = 1; i < ns.length; i++) {
        const d = ns[i] - ns[i - 1];
        if (d * dir < 0 || Math.abs(d) < 1 || Math.abs(d) > 3) {
            safe = false;
            break;
        }
    }
    if (debug) console.log(ns, safe);
    return safe;
}

const safe_count = input.replaceAll('\r', '').split('\n').reduce((safe_count, line) => {
    let safe = false;
    const split = line.split(' ');
    if (isSafe(split.map(n => parseInt(n)))) {
        safe = true;
    } else {
        for (let i = 0; i < split.length; i++) {
            const ns = split.map(n => parseInt(n));
            ns.splice(i, 1);
            if (isSafe(ns)) {
                safe = true;
                break;
            }
        }
    }
    if (debug) console.log(line, safe);
    if (safe) safe_count++;
    return safe_count;
}, 0);

console.log({ safe_count });

console.log(`${hrTime() - start}µs`);