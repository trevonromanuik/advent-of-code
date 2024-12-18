const fs = require("fs");
const path = require("path");

const test = false;
const debug = true;
const input_file = test ? "./test_input.txt" : "./input.txt";
const input = fs.readFileSync(path.resolve(__dirname, input_file), "utf-8");

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const program = input.replaceAll('\r', '').split('\n\n')[1].split(': ')[1].split(',').map((n) => {
    return BigInt(parseInt(n));
});

function op(a) {
    let b, c;
    b = a % 8n;
    b = b ^ 1n;
    c = (a >> b) % 8n;
    b = b ^ c;
    b = b ^ 4n;
    return b;
}

program.reverse();

function encode(n, pi) {
    if (pi === program.length) return n;
    n = n << 3n;
    for (let i = 0n; i < 8n; i++) {
        const n2 = n | i;
        if (op(n2) === program[pi]) {
            const r = encode(n2, pi + 1);
            if (r > 0) return r;
        }
    }
    return 0;
}
let a = encode(0n, 0);
console.log({ a });
console.log(`${hrTime() - start}µs`);
