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

function intersection(a, b) {
    return new Set(Array.from(a).filter((x) => {
        return b.has(x);
    }));
}

let largest_group = null;
const seen = new Set();
Object.keys(links).forEach((k) => {
    const q = [[k, new Set([k]), links[k]]];
    while (q.length) {
        const [k1, group, rest] = q.pop();
        // console.log(k1, group, rest);
        links[k1].forEach((k2) => {

            // does this new node contain links to all the previous nodes
            const new_group = intersection(group, links[k2]);
            if (new_group.size < group.size) return;
            new_group.add(k2);

            const group_key = Array.from(new_group).sort().join(',');
            if (seen.has(group_key)) return;
            seen.add(group_key);

            const new_rest = intersection(rest, links[k2]);
            if (new_rest.size === 0) {
                if (!largest_group || new_group.size > largest_group.size) {
                    largest_group = new_group;
                }
                return;
            }

            q.push([k2, new_group, new_rest]);

        });
    }
});
console.log(largest_group.size, Array.from(largest_group).sort().join(','));

console.log(`${hrTime() - start}µs`);