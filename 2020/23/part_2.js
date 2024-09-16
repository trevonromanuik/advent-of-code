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

const n_cups = 1000000;
const cups = new Array(n_cups);
const cups_map = new Array(n_cups + 1);
input.split('').forEach((c, i) => {
    const n = parseInt(c);
    cups[i] = { n: n, next: null };
    cups_map[n] = cups[i];
});
for (let i = input.length + 1; i <= n_cups; i++) {
    cups[i - 1] = { n: i, next: null };
    cups_map[i] = cups[i - 1];
}
for (let i = 0; i < cups.length; i++) {
    cups[i].next = cups[(i + 1) % cups.length];
}
let head = cups[0];

const num_moves = 10000000;
for (let move = 0; move < num_moves; move++) {
    // if (move % 100 === 0) console.log(`${move}/${num_moves} - ${hrTime() - start}µs`);
    const current_cup = head;
    const current_cup_label = head.n;
    const removed_head_cup = current_cup.next;
    current_cup.next = removed_head_cup.next.next.next;
    removed_head_cup.next.next.next = null;
    const removed_cups = [removed_head_cup.n, removed_head_cup.next.n, removed_head_cup.next.next.n];
    let destination_cup_label = current_cup_label;
    let destination_cup = null;
    while (destination_cup === null) {
        destination_cup_label -= 1;
        if (destination_cup_label < 1) destination_cup_label += n_cups;
        if (!!~removed_cups.indexOf(destination_cup_label)) continue;
        destination_cup = cups_map[destination_cup_label];
    }
    removed_head_cup.next.next.next = destination_cup.next;
    destination_cup.next = removed_head_cup;
    head = head.next;
}

const one_cup = cups_map[1];
console.log(one_cup.n, one_cup.next.n, one_cup.next.next.n);
console.log({ p: one_cup.next.n * one_cup.next.next.n });

console.log(`${hrTime() - start}µs`);