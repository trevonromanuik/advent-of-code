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

function parseValue(string, index) {
    if(string[index] === '(') return evaluate(string, index + 1);
    const v = parseInt(string.substring(index));
    return [v, index + v.toString().length];
}

function evaluate(string, index = 0) {
    let [v, i] = parseValue(string, index);
    // console.log({ v, i });
    let value = v;
    if(i === string.length || string[i] === ')') return[v, i + 1];
    while(true) {
        const op = string[i + 1];
        // console.log({ op });
        [v, i] = parseValue(string, i + 3);
        // console.log({ v, i });
        if(op === '+') value += v; else value *= v;
        if(i === string.length || string[i] === ')') return [value, i + 1];
    }
}

const sum = input.split('\n').reduce((sum, line) => {
    const [v] = evaluate(line);
    if(debug) console.log(line, v);
    return sum + v;
}, 0);

console.log({ sum });

console.log(`${hrTime() - start}µs`);