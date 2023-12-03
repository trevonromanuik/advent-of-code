const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function dec2binArray(dec) {
  const bin = new Array(36);
  bin.fill(0);
  const n = (dec >>> 0).toString(2);
  n.split('').forEach((c, i) => {
    bin[bin.length - n.length + i] = c;
  });
  return bin;
}

const mem = {};
let mask = null;
input.split('\n').forEach((line) => {
  if (line.startsWith('mask')) {
    mask = [];
    line.split(' = ')[1].split('').forEach((c, i) => {
      if (c === 'X') return;
      mask.push({ c, i });
    });
  } else {
    const mem_index = parseInt(line.substring(4));
    let mem_value = dec2binArray(parseInt(line.split(' = ')[1]));
    if (debug) console.log(`before\t`, mem_value.join(''));
    if (debug) console.log(`mask\t`, mask);
    mask.forEach(({ c, i }) => {
      mem_value[i] = c;
    });
    if (debug) console.log(`after\t`, mem_value.join(''));
    mem[mem_index] = parseInt(mem_value.join(''), 2);
  }
});
if (debug) console.log(JSON.stringify(mem, null, 2));
const sum = Object.values(mem).reduce((sum, n) => {
  return sum + n;
}, 0);
console.log(sum);