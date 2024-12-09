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

const digits = input.replaceAll('\r', '').split('').map((n) => {
    return parseInt(n);
});

let id = -1;
let head, tail;
const free_nodes = [];
digits.forEach((d, i) => {
    if (d === 0) return;
    const v = i % 2 === 0 ? ++id : '.';
    if (v === '.' && tail.v === '.') {
        tail.size += d;
    } else {
        const node = {
            v: v,
            size: d,
            prev: tail,
            next: null,
        };
        if (!head) head = node;
        if (tail) tail.next = node;
        tail = node;
        if (v === '.') free_nodes.push(node);
    }
});

if (debug) print(head);

let node = tail;
while (node && free_nodes.length) {
    const prev_node = node.prev;
    if (node.v === '.') {
        free_nodes.pop();
    } else {
        const size = node.size;
        const free_node = free_nodes.find((free_node) => {
            return free_node.size >= size;
        });
        if (free_node) {
            if (node.prev?.v === '.') {
                if (node.prev) node.prev.size += node.size;
                if (node.prev) node.prev.next = node.next;
                if (node.next) node.next.prev = node.prev;
                if (node.next?.v === '.') {
                    if (node.prev) node.prev.size += node.next.size;
                    if (node.prev) node.prev.next = node.next.next;
                }
            } else if (node.next?.v === '.') {
                if (node.next) node.next.size += node.size;
                if (node.prev) node.prev.next = node.next;
                if (node.next) node.next.prev = node.prev;
            } else {
                const new_node = {
                    v: '.',
                    size: node.size,
                    prev: node.prev,
                    next: node.next,
                };
                if (node.prev) node.prev.next = new_node;
                if (node.next) node.next.prev = new_node;
            }
            free_node.prev.next = node;
            node.prev = free_node.prev;
            node.next = free_node;
            free_node.prev = node;
            free_node.size -= size;
            if (!free_node.size) {
                if (free_node.next) free_node.next.prev = node;
                node.next = free_node.next;
            }
        }
    }
    node = prev_node;
    if (debug) print(head);
}

function print(head) {
    const a = [];
    let node = head;
    while (node) {
        for (let i = 0; i < node.size; i++) {
            a.push(node.v);
        }
        node = node.next;
    }
    console.log(a.join(''));
}

let sum = 0;
let index = -1;
node = head;
while (node) {
    for (let i = 0; i < node.size; i++) {
        index++;
        if (node.v !== '.') {
            if (debug) console.log(sum, node.v, index, node.v * index);
            sum += node.v * index;
        }
    }
    node = node.next;
}

console.log({ sum });
console.log(`${hrTime() - start}µs`);