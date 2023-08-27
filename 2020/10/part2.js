const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const ns = input.split('\r\n').map((line) => {
  return parseInt(line);
}).sort((a, b) => (a - b));
ns.unshift(0);
ns.push(ns[ns.length - 1] + 3);

const scores = { [ns[ns.length - 1]]: 1 };
for(let i = ns.length - 2; i >= 0; i--) {
  let score = 0;
  for(let j = i + 1; j < ns.length; j++) {
    if(ns[j] - ns[i] <= 3) {
      score += scores[ns[j]];
    } else {
      break;
    }
  }
  scores[ns[i]] = score;
  console.log(ns[i], score);
}