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

const [replacements_chunk, molecule] = input.split('\n\n');
const replacements = replacements_chunk.split('\n').reduce((replacements, line) => {
  const [l, r] = line.split(' => ');
  if (!replacements[l]) replacements[l] = [];
  replacements[l].push(r);
  return replacements;
}, {});

const seen = new Set();
for (let i = 0; i < molecule.length; i++) {
  for (let j = 1; j <= 2; j++) {
    if (i + j > molecule.length) continue;
    const c = molecule.substring(i, i + j);
    if (replacements.hasOwnProperty(c)) {
      for (let k = 0; k < replacements[c].length; k++) {
        const new_molecule = molecule.substring(0, i) + replacements[c][k] + molecule.substring(i + j);
        if (!seen.has(new_molecule)) {
          if (test) console.log(new_molecule);
          seen.add(new_molecule);
        }
      }
    }
  }
}

console.log({ count: seen.size });

console.log(`${hrTime() - start}µs`);