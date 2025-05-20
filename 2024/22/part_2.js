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

function mix(a, b) {
    return a ^ b;
}

function prune(a) {
    const b = 16777216;
    a = a % b;
    if (a < 0) a += b;
    return a;
}

function nextSecret(secret) {
    secret = prune(mix(secret * 64, secret));
    secret = prune(mix(Math.floor(secret / 32), secret));
    secret = prune(mix(secret * 2048, secret));
    return secret;
}

const N_SEQ = 2000;
const dicts = input.replaceAll('\r', '').split('\n').map((line) => {
    const dict = {};
    const prevs = [];
    let ps = parseInt(line);
    for (let i = 0; i < N_SEQ; i++) {
        const ns = nextSecret(ps);
        const delta = (ns % 10) - (ps % 10);
        prevs.push(delta);
        if (prevs.length == 4) {
            const key = prevs.join(',');
            prevs.shift();
            if (!dict.hasOwnProperty(key)) dict[key] = ns % 10;
        }
        ps = ns;
    }
    return dict;
}, 0);

const seen = new Set();
let max_price = -Infinity;
let max_key = null;
for (let i = 0; i < dicts.length; i++) {
    const dict = dicts[i];
    const keys = Object.keys(dict);
    for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (seen.has(key)) continue;
        seen.add(key);
        let price = 0;
        for (let k = i; k < dicts.length; k++) {
            price += dicts[k][key] ?? 0;
        }
        if (price > max_price) {
            max_price = price;
            max_key = key;
        }
    }
}
console.log(max_key, max_price, dicts.map((dict) => dict[max_key] ?? 0));

console.log(`${hrTime() - start}µs`);