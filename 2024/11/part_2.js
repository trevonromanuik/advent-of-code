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

const expansions = {};
function expand(n, steps) {
    if (debug) console.log('expand', n, steps);
    if (!expansions[n]) expansions[n] = [1];
    if (expansions[n].length <= steps) {
        if (n === 0) {
            const new_n = 1;
            expand(new_n, steps - 1);
            expansions[n] = [1, ...expansions[new_n]];// expansions[n].concat(expansions[new_n]);
        } else if (n.toString().length % 2 === 0) {
            const ns = n.toString();
            const nl = ns.length;
            const l = parseInt(ns.substring(0, nl / 2));
            const r = parseInt(ns.substring(nl / 2));
            expand(l, steps - 1);
            expand(r, steps - 1);
            expansions[n] = [1];
            for (let i = 0; i < steps; i++) {
                expansions[n].push(expansions[l][i] + expansions[r][i]);
            }
        } else {
            const new_n = n * 2024;
            expand(new_n, steps - 1);
            expansions[n] = [1, ...expansions[new_n]];// expansions[n].concat(expansions[new_n]);
        }
    }
}

const steps = 75;
const count = input.split(' ').map((n) => {
    return parseInt(n);
}).reduce((count, n) => {
    expand(n, steps);
    return count + expansions[n][steps];
}, 0);

console.log({ count });
console.log(`${hrTime() - start}µs`);