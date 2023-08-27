const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const preamble = test ? 5 : 25;
const ns = input.split('\r\n').map((line) => {
  return parseInt(line);
});

for(let i = preamble; i < ns.length; i++) {
  const n = ns[i];
  // console.log(i, n);
  let found = false;
  for(let j = 1; j <= preamble; j++) {
    for(let k = j + 1; k <= preamble; k++) {
      // console.log('\t', i, j, k, ns[i - j], ns[i - k], ns[i - j] + ns[i - k], n);
      if(ns[i - j] + ns[i - k] === n) {
        found = true;
        break;
      }
    }
    if(found) break;
  }
  if(!found) {
    console.log(i, n);
    break;
  }
}