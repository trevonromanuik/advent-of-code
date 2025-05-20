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
    if (secret < 0) secret += 16777216;
    return secret;
}

const sum = input.replaceAll('\r', '').split('\n').reduce((sum, line) => {
    let s = line;
    for (let i = 0; i < 2000; i++) {
        s = nextSecret(s);
    }
    return sum + s;
}, 0);
console.log(sum);

console.log(`${hrTime() - start}µs`);