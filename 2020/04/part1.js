const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const req = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const v = input.split('\r\n\r\n').reduce((v, lines) => {
  const f = new Set(req);
  lines.split('\r\n').forEach((l) => {
    l.split(' ').forEach((s) => {
      f.delete(s.split(':')[0]);
    });
  });
  return f.size ? v : v + 1;
}, 0);
console.log(v);