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

while(true) {
    const c1 = players[0].shift();
    const c2 = players[1].shift();
    if (c1 > c2) {
        players[0].push(c1);
        players[0].push(c2);
        if (players[1].length === 0) {
            break;
        }
    } else {
        players[1].push(c2);
        players[1].push(c1);
        if (players[0].length === 0) {
            break;
        }
    }
}

const winner = players[0].length > 0 ? players[0] : players[1];
const score = winner.reduce((score, card, i) => {
    return score + card * (winner.length - i);
}, 0);
console.log({ score });

console.log(`${hrTime() - start}µs`);