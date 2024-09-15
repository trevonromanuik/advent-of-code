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

const players = input.replaceAll('\r', '').split('\n\n').map((chunk) => {
    const cards = chunk.split('\n');
    cards.shift();
    return cards.map((card) => parseInt(card));
});

GID = 0;
function run(p1, p2) {
    const gid = ++GID;
    const seen = new Set();
    while(true) {
        const hash = JSON.stringify({ p1, p2 });
        if (seen.has(hash)) return -1;
        seen.add(hash);
        const c1 = p1.shift();
        const c2 = p2.shift();
        if (p1.length >= c1 && p2.length >= c2) {
            const p1_slice = p1.slice(0, c1);
            const p2_slice = p2.slice(0, c2);
            const r = run(p1_slice, p2_slice);
            if (r < 0) {
                p1.push(c1);
                p1.push(c2);
            } else {
                p2.push(c2);
                p2.push(c1);
            }
        } else {
            if (c1 > c2) {
                p1.push(c1);
                p1.push(c2);
            } else {
                p2.push(c2);
                p2.push(c1);
            }
        }
        if (p1.length === 0) {
            return 1;
        }
        if (p2.length === 0) {
            return -1;
        }
    }
}

const r = run(players[0], players[1]);
console.log(players);
const winner = r < 0 ? players[0] : players[1];
const score = winner.reduce((score, card, i) => {
    return score + card * (winner.length - i);
}, 0);
console.log({ score });

console.log(`${hrTime() - start}µs`);