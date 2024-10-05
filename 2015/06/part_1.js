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

const on = new Set();
input.replaceAll('\r', '').split('\n').forEach((line) => {
    ['turn on', 'turn off', 'toggle'].forEach((prefix) => {
        if (line.startsWith(prefix)) {
            const coords = line.substring(prefix.length + 1).split(' through ').map((s) => {
                return s.split(',').map((n) => {
                    return parseInt(n);
                });
            });
            for (let i = coords[0][0]; i <= coords[1][0]; i++) {
                for (let j = coords[0][1]; j <= coords[1][1]; j++) {
                    const coord = `${i},${j}`;
                    if (prefix === 'turn on') {
                        on.add(coord);
                    } else if (prefix === 'turn off') {
                        on.delete(coord);
                    } else if (prefix === 'toggle') {
                        if (on.has(coord)) {
                            on.delete(coord);
                        } else {
                            on.add(coord);
                        }
                    }
                }
            }
        }
    });
});
console.log(on.size);

console.log(`${hrTime() - start}µs`);