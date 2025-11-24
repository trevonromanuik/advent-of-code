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

const target = 'fbgdceah';
const lines = input.replaceAll('\r', '').split('\n')

function run(s) {
  lines.forEach((line) => {
    const split = line.split(' ');
    if (split[0] === 'swap') {
      if (split[1] === 'position') {
        const ix = parseInt(split[2]);
        const jx = parseInt(split[5]);
        const t = s[ix];
        s[ix] = s[jx];
        s[jx] = t;
      } else {
        const ci = split[2];
        const cj = split[5];
        for (let i = 0; i < s.length; i++) {
          if (s[i] === ci) s[i] = cj;
          else if (s[i] === cj) s[i] = ci;
        }
      }
    } else if (split[0] === "rotate") {
      let steps;
      if (split[1] === "based") {
        steps = s.indexOf(split[6]);
        if (steps >= 4) steps++;
        steps++;
        steps %= s.length;
        steps *= -1;
      } else {
        const dir = split[1] === "left" ? 1 : -1;
        steps = parseInt(split[2]) * dir;
      }
      const t = new Array(s.length);
      for (let i = 0; i < s.length; i++) {
        let ix = i + steps;
        if (ix >= s.length) ix -= s.length;
        else if (ix < 0) ix += s.length;
        t[i] = s[ix];
      }
      s = t;
    } else if (split[0] === "reverse") {
      const ix = parseInt(split[2]);
      const jx = parseInt(split[4]);
      const t = s.slice(ix, jx + 1);
      for (let i = 0; i < t.length; i++) {
        s[jx - i] = t[i];
      }
    } else if (split[0] === "move") {
      const ix = parseInt(split[2]);
      const jx = parseInt(split[5]);
      const [t] = s.splice(ix, 1);
      s.splice(jx, 0, t);
    }
  });
  return s.join('');
}

const all_chars = new Set('abcdefgh'.split(''));
let done = false;
function recurse(chars, s) {
  if (done) return;
  if (s.length < all_chars.size) {
    chars.forEach((c) => {
      const new_chars = new Set([...chars]);
      new_chars.delete(c);
      const new_s = [...s, c];
      recurse(new_chars, new_s);
    });
  } else {
    const scrambled = run([...s]);
    if (scrambled === target) {
      console.log({ s: s.join('') });
      done = true;
    }
  }
}
recurse(all_chars, []);

console.log(`${hrTime() - start}µs`);