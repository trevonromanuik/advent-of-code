const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const pows = [1];
function pow(n) {
  if(pows.length <= n) {
    for(let i = pows.length; i <= n; i++) {
      pows.push(5 * pows[i - 1]);
    }
  }
  return pows[n];
}

const dmaxes = [0];
function dmax(n) {
  if(dmaxes.length <= n) {
    for(let i = dmaxes.length; i <= n; i++) {
      dmaxes.push(2 * pow(i - 1) + dmaxes[i - 1]);
    }
  }
  return dmaxes[n];
}

const dmins = [0];
function dmin(n) {
  if(dmins.length <= n) {
    for(let i = dmins.length; i <= n; i++) {
      dmins.push(-2 * pow(i - 1) + dmins[i - 1]);
    }
  }
  return dmins[n];
}

function base5to10(s) {
  const digits = s.split('').reverse();
  // console.log(digits);
  let sum = 0;
  for(let i = 0; i < digits.length; i++) {
    const p = pow(i);
    // console.log(i, p);
    switch(digits[i]) {
      case '2':
        sum += 2 * p;
        // console.log(sum);
        break;
      case '1':
        sum += p;
        // console.log(sum);
        break;
      case '0':
        break;
      case '-':
        sum -= p;
        // console.log(sum);
        break;
      case '=':
        sum -= 2 * p;
        // console.log(sum);
        break;
    }
  }
  return sum;
}

function base10to5(n) {
  let i = 1;
  while(n > dmax(i)) {
    i++;
  }
  const a = [];
  while(a.length < i) {
    const p = pow(i - a.length - 1);
    const m = dmin(i - a.length - 1);
    const d = Math.floor((n - m) / p);
    n -= d * p;
    switch(d) {
      case -2:
        a.push('=');
        break;
      case -1:
        a.push('-');
        break;
      default:
        a.push(d);
        break;
    }
  }
  return a.join('');
}

const lines = input.split('\r\n');
const n = lines.reduce((sum, l) => {
  return sum + base5to10(l);
}, 0);
const s = base10to5(n);
console.log({ n, s });