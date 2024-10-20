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

const [code_count, mem_count] = input.replaceAll('\r', '').split('\n').reduce(([code_count, mem_count], line) => {
    const line_code_count = line.length;
    let line_mem_count = -2;
    for (let i = 0; i < line.length; i++) {
        line_mem_count++;
        if (line[i] === '\\') {
            i += 1;
            if (line[i] === 'x') {
                i += 2;
            }
        }
    }
    console.log(line, line_code_count, line_mem_count);
    return [code_count + line_code_count, mem_count + line_mem_count];
}, [0, 0]);

console.log({ code_count, mem_count });
console.log(code_count - mem_count);

console.log(`${hrTime() - start}µs`);