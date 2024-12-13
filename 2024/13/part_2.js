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

const r = /X[+=](\d+), Y[+=](\d+)/;
const total = input.replaceAll('\r', '').split('\n\n').reduce((total, chunk) => {
    let [[ax, ay], [bx, by], [px, py]] = chunk.split('\n').map((line) => {
        const [, x, y] = r.exec(line);
        return [parseInt(x), parseInt(y)];
    });
    px += 10000000000000;
    py += 10000000000000;
    const bn = ((ax * py) - (ay * px)) / ((ax * by) - (ay * bx));
    const dx = px - (bn * bx);
    const an = dx / ax;
    if (Math.floor(bn) === bn && Math.floor(an) === an) {
        const cost = (an * 3) + bn;
        if (debug) console.log({ px, py, bn, an, cost });
        total += cost;
    }
    return total;
}, 0);

console.log({ total });
console.log(`${hrTime() - start}µs`);