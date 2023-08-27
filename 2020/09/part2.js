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

let target_n;
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
    target_n = n;
    console.log(i, n);
    break;
  }
}

for(let i = 0; i < ns.length - 1; i++) {
  let sum = ns[i] + ns[i + 1];
  let min = Math.min(ns[i], ns[i + 1]);
  let max = Math.max(ns[i], ns[i + 1]);
  let j = i + 2;
  while(sum < target_n && j < ns.length) {
    sum += ns[j];
    min = Math.min(min, ns[j]);
    max = Math.max(max, ns[j]);
    j++;
  }
  if(sum === target_n) {
    console.log(i, j, min, max, min + max);
    break;
  }
}