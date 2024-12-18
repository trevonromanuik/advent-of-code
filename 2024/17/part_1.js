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

const [registers_chunk, program_chunk] = input.replaceAll('\r', '').split('\n\n');
let [a, b, c] = registers_chunk.split('\n').map((line) => {
    return parseInt(line.split(': ')[1]);
});
const program = program_chunk.split(': ')[1].split(',').map((n) => {
    return parseInt(n);
});

function combo(operand) {
    return [0, 1, 2, 3, a, b, c][operand];
}

const out = [];
for (let i = 0; i < program.length; i += 2) {
    const opcode = program[i];
    const operand = program[i + 1];
    switch (opcode) {
        case 0: {
            // adv
            a = Math.floor(a / Math.pow(2, combo(operand)));
            break;
        }
        case 1: {
            // bxl
            b = b ^ operand;
            break;
        }
        case 2: {
            // bst
            b = combo(operand) % 8;
            break;
        }
        case 3: {
            // jnz
            if (a !== 0) i = operand - 2;
            break;
        }
        case 4: {
            // bxc
            b = b ^ c;
            break;
        }
        case 5: {
            // out
            out.push(combo(operand) % 8);
            break;
        }
        case 6: {
            // bdv
            b = Math.floor(a / Math.pow(2, combo(operand)));
            break;
        }
        case 7: {
            // cdv
            c = Math.floor(a / Math.pow(2, combo(operand)));
            break;
        }
    }
}

console.log(out.join(','));
console.log(`${hrTime() - start}µs`);