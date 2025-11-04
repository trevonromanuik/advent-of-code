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

const values = `
children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1
`.trim().split('\n').reduce((values, line) => {
  const [l, r] = line.split(': ');
  values[l] = parseInt(r);
  return values;
}, {});

const sues = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.substring(line.indexOf(': ') + 2).split(', ').reduce((values, line) => {
    const [l, r] = line.split(': ');
    values[l] = parseInt(r);
    return values;
  }, {});
});

const index = sues.findIndex((sue) => {
  return Object.keys(sue).every((k) => {
    if (k === "cats" || k === "trees") {
      return sue[k] > values[k];
    } else if (k === "pomeranians" || k == "goldfish") {
      return sue[k] < values[k];
    } else {
      return sue[k] === values[k];
    }
  });
});

console.log(index + 1);

console.log(`${hrTime() - start}µs`);