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

const [towels_chunk, patterns_chunk] = input.replaceAll('\r', '').split('\n\n');
const towels = towels_chunk.split(', ').reduce((towels, towel) => {
    if (!towels[towel[0]]) towels[towel[0]] = [];
    towels[towel[0]].push(towel);
    return towels;
}, {});

Object.keys(towels).forEach((k) => {
    towels[k].sort((a, b) => {
        return b.length - a.length;
    });
});

const count = patterns_chunk.split('\n').reduce((count, pattern) => {
    const q = [''];
    const prevs = new Map();
    let found = false;
    while (q.length) {
        const p = q.shift();
        const c = pattern[p.length];
        if (towels[c]) {
            inner_loop: for (let i = 0; i < towels[c].length; i++) {
                const t = towels[c][i];
                for (let j = 1; j < t.length; j++) {
                    if (t[j] !== pattern[p.length + j]) {
                        continue inner_loop;
                    }
                }
                const np = `${p}${t}`;
                if (np === pattern) found = true;
                if (!prevs.has(np)) {
                    prevs.set(np, [p]);
                    q.push(np);
                } else {
                    prevs.get(np).push(p);
                }
            }
        }
    }
    const path_counts = new Map();
    if (found) {
        function countPaths(p) {
            if (path_counts.has(p)) return path_counts.get(p);
            if (!prevs.has(p)) return 1;
            return prevs.get(p).reduce((sum, p) => {
                const c = countPaths(p);
                path_counts.set(p, c);
                return sum + c;
            }, 0);
        }
        const inner_count = countPaths(pattern);
        if (debug) console.log({ pattern, inner_count });
        count += inner_count;
    }
    return count;
}, 0);

console.log({ count });
console.log(`${hrTime() - start}µs`);