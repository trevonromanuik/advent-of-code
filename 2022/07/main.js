const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const root = {
    parent: null,
    size: 0,
    children: {},
};

let node = root;
const lines = input.split('\n');
for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const split = line.split(' ');
    if(split[0] === '$') {
        if(split[1] === 'cd') {
            if(split[2] === '/') {
                node = root;
            } else if(split[2] === '..') {
                node = node.parent;
            } else {
                node = node.children[split[2]];
            }
        } else if(split[1] === 'ls') {
            // do nothing
        }
    } else if(split[0] === 'dir') {
        node.children[split[1]] = {
            parent: node,
            size: 0,
            children: {},
        };
    } else {
        node.children[split[1]] = parseInt(split[0]);
    }
}

function print(node, name, prefix = '') {
    if(typeof node === 'number') {
        console.log(`${prefix}- ${name} (file, size=${node})`);
    } else {
        console.log(`${prefix}- ${name} (dir, size=${node.size})`);
        Object.keys(node.children).forEach((key) => {
            print(node.children[key], key, `${prefix} `);
        });
    }
}

let sum = 0;
function calculate_sizes(node, key) {
    if(typeof node === 'number') {
        return node;
    } else {
        node.size = Object.keys(node.children).reduce((acc, key) => {
            return acc + calculate_sizes(node.children[key], key);
        }, 0);
        if(node.size <= 100000) {
            console.log(key, node.size)
            sum += node.size;
        }
        return node.size;
    }
}

calculate_sizes(root, '/');
// print(root, '/');
console.log(`part 1: ${sum}`);

const total_disk = 70000000;
const unused_disk = total_disk - root.size;
const free_disk = 30000000 - unused_disk;

function find_best_node(node) {
    let best_node = node.size > free_disk ? node : null;
    Object.keys(node.children).forEach((key) => {
        const child = node.children[key];
        if(typeof child === 'object') {
            const next_best_node = find_best_node(child);
            if(next_best_node) {
                if(!best_node || next_best_node.size < best_node.size) {
                    best_node = next_best_node;
                }
            }
        }
    });
    return best_node;
}

const best_node = find_best_node(root);
console.log(best_node.size);