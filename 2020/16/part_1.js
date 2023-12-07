const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

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
const nearby_tickets = sections[2].split('\n').slice(1).map((line) => {
    return line.split(',').map(n => parseInt(n));
});

if (debug) console.log(JSON.stringify({ rules }));
if (debug) console.log(JSON.stringify({ nearby_tickets }));

const sum = nearby_tickets.reduce((sum, values) => {
    values.forEach((v) => {
        if (!rules.some(({ ranges }) => {
            return ranges.some(([i, j]) => {
                return v >= i && v <= j;
            });
        })) {
            if (debug) console.log(v);
            sum += v;
        }
    });
    return sum;
}, 0);

console.log(sum);
console.log(`${Date.now() - start}ms`);