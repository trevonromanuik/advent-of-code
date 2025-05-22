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

const links = {};
input.replaceAll('\r\n').split('\n').forEach((line) => {
    const [l, r] = line.split('-');
    [[l, r], [r, l]].forEach(([a, b]) => {
        if (!links[a]) links[a] = new Set();
        links[a].add(b);
    });
});

const seen = Object.keys(links).reduce((seen, k1) => {
    if (k1[0] === 't') {
        links[k1].forEach((k2) => {
            links[k2].forEach((k3) => {
                if (links[k3].has(k1)) {
                    const group = [k1, k2, k3].sort().join(',');
                    if (!seen.has(group)) {
                        console.log(group);
                        seen.add(group);
                    }
                }
            });
        });
    }
    return seen;
}, new Set());
console.log(seen.size);

console.log(`${hrTime() - start}µs`);