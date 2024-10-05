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

const on = {};
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
                        if (!on[coord]) on[coord] = 1;
                        else on[coord] += 1;
                    } else if (prefix === 'turn off') {
                        if (on[coord]) on[coord]--;
                        if (on[coord] === 0) delete on[coord];
                    } else if (prefix === 'toggle') {
                        if (!on[coord]) on[coord] = 2;
                        else on[coord] += 2;
                    }
                }
            }
        }
    });
});
const brightness = Object.keys(on).reduce((sum, key) => {
    return sum + on[key];
}, 0);
console.log(brightness);

console.log(`${hrTime() - start}µs`);