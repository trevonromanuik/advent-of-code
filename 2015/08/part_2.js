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

const [code_count, encoded_count] = input.replaceAll('\r', '').split('\n').reduce(([code_count, encoded_count], line) => {
    const line_code_count = line.length;
    let line_encoded_count = 2;
    for (let i = 0; i < line.length; i++) {
        line_encoded_count++;
        if (line[i] === '\\' || line[i] === '"') {
            line_encoded_count++;
        }
    }
    console.log(line, line_code_count, line_encoded_count);
    return [code_count + line_code_count, encoded_count + line_encoded_count];
}, [0, 0]);

console.log({ code_count, encoded_count });
console.log(encoded_count - code_count);

console.log(`${hrTime() - start}µs`);