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

function reduce(total, n, nums, i) {
    if (i === nums.length) return n === total;
    if (n > total) return false;
    if (reduce(total, n * nums[i], nums, i + 1)) return true;
    if (reduce(total, parseInt(`${n}${nums[i]}`), nums, i + 1)) return true;
    if (reduce(total, n + nums[i], nums, i + 1)) return true;
    return false;
}

const sum = input.replaceAll('\r', '').split('\n').reduce((sum, line) => {
    const [l, r] = line.split(': ');
    const total = parseInt(l);
    const nums = r.split(' ').map((n) => parseInt(n));
    if (reduce(total, nums[0], nums, 1)) sum += total;
    return sum;
}, 0);

console.log({ sum });

console.log(`${hrTime() - start}µs`);