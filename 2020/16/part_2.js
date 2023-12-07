const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input2.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

function stringify(o) {
    return JSON.stringify(o, (k, v) => {
        return v instanceof Set ? [...v] : v;
    });
}

const sections = input.split('\n\n');
const rules = sections[0].split('\n').map((line) => {
    const [label, ranges] = line.split(': ');
    return {
        label,
        ranges: ranges.split(' or ').map((range) => {
            return range.split('-').map(n => parseInt(n));
        }),
    }
});
const my_ticket = sections[1].split('\n')[1].split(',').map(n => parseInt(n));
const nearby_tickets = sections[2].split('\n').slice(1).map((line) => {
    return line.split(',').map(n => parseInt(n));
}).filter((values) => {
    return values.every((v) => {
        return rules.some(({ ranges }) => {
            return ranges.some(([i, j]) => {
                return v >= i && v <= j;
            });
        });
    });
});

if (debug) console.log(stringify({ rules }));
if (debug) console.log(stringify({ my_ticket }));
if (debug) console.log(stringify({ nearby_tickets }));

const rule_labels = rules.map(({ label }) => label);
if (debug) console.log(stringify({ rule_labels }));
const possible_labels = my_ticket.map((n, i) => {
    return {
        i: i,
        labels: new Set(rule_labels.filter((label, j) => {
            const { ranges } = rules[j];
            return nearby_tickets.every((ticket) => {
                const n = ticket[i];
                return ranges.some(([i, j]) => {
                    return n >= i && n <= j;
                });
            });
        })),
    };
}).sort((a, b) => {
    return a.labels.size < b.labels.size ? -1 : 1;
});
if (debug) console.log(stringify({ possible_labels }));
const mapped_labels = new Set();
const label_mappings = {};
possible_labels.forEach(({ i, labels }) => {
    if (labels.size > 1) {
        mapped_labels.forEach(l => labels.delete(l));
    }
    const label = Array.from(labels)[0];
    label_mappings[label] = i;
    mapped_labels.add(label);
});
if (debug) console.log(stringify({ label_mappings }));
const p = rule_labels.filter((l) => {
    return l.startsWith('departure');
}).reduce((p, l) => {
    return p * my_ticket[label_mappings[l]];
}, 1);
console.log(p);
console.log(`${Date.now() - start}ms`);