const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function dec2binArray(dec) {
    const bin = new Array(36);
    bin.fill('0');
    const n = (dec >>> 0).toString(2);
    n.split('').forEach((c, i) => {
        bin[bin.length - n.length + i] = c;
    });
    return bin;
}

function float(bin, mask, i) {
    // console.log(`float`, bin, mask, i);
    i = mask.indexOf('X', i);
    if (i === -1) {
        return [parseInt(bin.join(''), 2)];
    } else {
        return [
            ...float([...bin.slice(0, i), '0', ...bin.slice(i + 1)], mask, i + 1),
            ...float([...bin.slice(0, i), '1', ...bin.slice(i + 1)], mask, i + 1),
        ];
    }
}

const mem = {};
let mask = null;
input.split('\n').forEach((line) => {
    if (line.startsWith('mask')) {
        mask = line.split(' = ')[1].split('');
    } else {
        let mem_index = dec2binArray(parseInt(line.substring(4)));
        const mem_value = parseInt(line.split(' = ')[1]);
        mask.forEach((c, i) => {
            if (c === '1') mem_index[i] = c;
        });
        const mem_indexes = float(mem_index, mask, 0);
        mem_indexes.forEach((i) => {
            if (debug) console.log(`mem[${i}] = ${mem_value}`);
            mem[i] = mem_value;
        });
    }
});
if (debug) console.log(JSON.stringify(mem, null, 2));
const sum = Object.values(mem).reduce((sum, n) => {
    return sum + n;
}, 0);
console.log(sum);