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

function evaluate(string) {
    // console.log('-----');
    // console.log(string);
    let index = 0;
    while((index = string.indexOf('(', index)) > -1) {
        let next_close = string.indexOf(')', index + 1);
        let next_open = string.indexOf('(', index + 1);
        while(next_open > -1 && next_open < next_close) {
            next_close = string.indexOf(')', next_close + 1);
            next_open = string.indexOf('(', next_open + 1);
        }
        string = `${string.substring(0, index).trim()} ${evaluate(string.substring(index + 1, next_close))} ${string.substring(next_close + 1).trim()}`.trim();
        // console.log(string);
    }
    for(let op of ['+', '*']) {
        let index = 0;
        while((index = string.indexOf(op, index)) > -1) {
            let prev_index = string.lastIndexOf(' ', index - 2) + 1;
            const l = parseInt(string.substring(prev_index));
            const r = parseInt(string.substring(index + 2));
            const v = (op === '+') ? l + r : l * r;
            string = `${string.substring(0, prev_index).trim()} ${v} ${string.substring(index + 2 + r.toString().length).trim()}`.trim();
            // console.log(string);
        }
    }
    // console.log('-----');
    return parseInt(string);
}

const sum = input.split('\n').reduce((sum, line) => {
    const v = evaluate(line);
    if(debug) console.log(line, v);
    return sum + v;
}, 0);

console.log({ sum });

console.log(`${hrTime() - start}µs`);