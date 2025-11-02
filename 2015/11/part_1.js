const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const MIN = 97;
const MAX = 122;
const IOL = new Set([105, 111, 108]);

const password = input.split('').map((c) => {
    return c.charCodeAt(0);
});

function isValid(p) {

  let has_straight = false;
  let first_pair = null;
  let second_pair = null;
  for (let i = 0; i < p.length; i++) {

    // no i, o, or l
    for (let i = 0; i < p.length; i++) {
      if (IOL.has(p[i])) {
        if (debug) console.log(`${String.fromCharCode(p[i])} found`);
        return false;
      }
    }

    // increasing straight of 3 letters
    if (!has_straight && i + 2 < p.length) {
      if (p[i + 1] === p[i] + 1 && p[i + 2] === p[i] + 2) {
        has_straight = true;
        if (debug) console.log(`straight found`, String.fromCharCode(p[i], p[i + 1], p[i + 2]));
      }
    }

    // two different pairs
    if (!second_pair && i + 1 < p.length) {
      if (p[i] === p[i + 1]) {
        if (first_pair) {
          if (p[i] === first_pair) {
            if (debug) console.log(`duplicate pair found`);
            return false;
          }
          if (debug) console.log(`second pair found`, String.fromCharCode(p[i], p[i + 1]));
          second_pair = p[i];
        } else {
          if (debug) console.log(`first pair found`, String.fromCharCode(p[i], p[i + 1]));
          first_pair = p[i];
        }
      }
    }
  }

  if (!has_straight) {
    if (debug) console.log(`no straight found`);
    return false;
  }

  if (!second_pair) {
    if (debug) console.log(`no second pair`);
    return false;
  }

  return true;

}

while (!isValid(password)) {
  for (let i = password.length - 1; i >= 0; i--) {
    password[i] = password[i] === MAX ? MIN : password[i] + 1;
    if (password[i] !== MIN) break;
  }
  if (debug) console.log(String.fromCharCode(...password));
}

console.log(String.fromCharCode(...password));

console.log(`${hrTime() - start}µs`);