const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const ns = input.split('\r\n').map((l) => {
  return parseInt(l);
});

for(let i = 0; i < ns.length; i++) {
  for(let j = i + 1; j < ns.length; j++) {
    if(ns[i] + ns[j] === 2020) {
      console.log(ns[i] * ns[j]);
      process.exit(0);
    }
  }
}