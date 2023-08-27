const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const req = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const n = input.split('\r\n\r\n').reduce((n, lines) => {
  const f = new Set(req);
  lines.split('\r\n').forEach((l) => {
    l.split(' ').forEach((s) => {
      const [k, v] = s.split(':');
      let valid = true;
      switch(k) {
        case 'byr': {
          if(v.length !== 4) { 
            valid = false 
          } else {
            const n = parseInt(v);
            valid = n >= 1920 && n <= 2002;
          }
          break;
        }
        case 'iyr': {
          if(v.length !== 4) { 
            valid = false 
          } else {
            const n = parseInt(v);
            valid = n >= 2010 && n <= 2020;
          }
          break;
        }
        case 'eyr': {
          if(v.length !== 4) { 
            valid = false 
          } else {
            const n = parseInt(v);
            valid = n >= 2020 && n <= 2030;
          }
          break;
        }
        case 'hgt': {
          if(v.endsWith('cm')) {
            const n = parseInt(v);
            valid = n >= 150 && n <= 193;
          } else if(v.endsWith('in')) {
            const n = parseInt(v);
            valid = n >= 59 && n <= 76;
          } else {
            valid = false;
          }
          break;
        }
        case 'hcl': {
          valid = /^#[0-9a-f]{6}$/.test(v);
          break;
        }
        case 'ecl': {
          valid = !!{
            'amb': true,
            'blu': true,
            'brn': true,
            'gry': true,
            'grn': true,
            'hzl': true,
            'oth': true,
          }[v];
          break;
        }
        case 'pid': {
          valid = /^\d{9}$/.test(v);
          break;
        }
      }
      if(k === 'pid') console.log({ k, v, valid });
      if(valid) f.delete(k);
    });
  });
  return f.size ? n : n + 1;
}, 0);
console.log(n);