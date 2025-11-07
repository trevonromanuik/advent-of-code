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

let min_replacement_length = Infinity;
let max_replacement_length = -Infinity;
const [replacements_chunk, molecule] = input.split('\n\n');
const replacements = replacements_chunk.split('\n').reduce((replacements, line) => {
  const [l, r] = line.split(' => ');
  if (!replacements[r]) replacements[r] = [];
  replacements[r].push(l);
  if (r.length < min_replacement_length) min_replacement_length = r.length;
  if (r.length > max_replacement_length) max_replacement_length = r.length;
  return replacements;
}, {});

const steps = { [molecule]: 0 };
const q = [molecule];
while (q.length) {
  if (steps['e']) break;
  const s = q.pop();
  for (let i = 0; i < s.length; i++) {
    if (steps['e']) break;
    for (let j = max_replacement_length; j >= min_replacement_length; j--) {
      if (steps['e']) break;
      if (i + j > s.length) continue;
      const c = s.substring(i, i + j);
      if (replacements.hasOwnProperty(c)) {
        for (let k = 0; k < replacements[c].length; k++) {
          if (steps['e']) break;
          const new_s = s.substring(0, i) + replacements[c][k] + s.substring(i + j);
          if (!steps.hasOwnProperty(new_s)) {
            steps[new_s] = steps[s] + 1;
            q.push(new_s);
          }
          if (steps['e']) break;
        }
      }
    }
  }
}

console.log({ steps: steps['e'] });

console.log(`${hrTime() - start}µs`);