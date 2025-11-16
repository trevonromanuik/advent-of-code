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

const crypto = require('crypto');

function getMatches(n) {
  let hash = `${input}${n}`;
  for (let i = 0; i < 2017; i++) {
    hash = crypto.createHash('md5').update(hash).digest('hex');
  }
  let triple = null;
  const pentas = new Set();
  for (let i = 0; i < hash.length - 2; i++) {
    if (hash[i] === hash[i + 1] && hash[i] === hash[i + 2]) {
      if (!triple) triple = hash[i];
      if (i < hash.length - 4) {
        if (hash[i] === hash[i + 3] && hash[i] === hash[i + 4]) {
          pentas.add(hash[i]);
        }
      }
    }
  }
  return { triple, pentas };
}

let matches = {};
let found = 0;
let ni = -1;
let nj = 0;
while (found < 64) {
  ni++;
  if (!matches[ni]) {
    // short out if we already checked hash nj and found no matches
    if (ni < nj) continue;
    nj = ni;
    const { triple, pentas } = getMatches(ni);
    if (triple || pentas.size) matches[ni] = { triple, pentas };
  }
  if (!matches[ni]?.triple) continue;
  const triple = matches[ni].triple;
  for (let i = ni + 1; i <= ni + 1000; i++) {
    if (!matches[i]) {
      if (i < nj) continue;
      nj = i;
      const { triple, pentas } = getMatches(i);
      if (triple || pentas.size) matches[i] = { triple, pentas };
    }
    if (!matches[i]?.pentas) continue;
    const pentas = matches[i].pentas;
    if (pentas.has(triple)) {
      found++;
      if (test) {
        const h1 = crypto.createHash('md5').update(`${input}${ni}`).digest('hex')
        const h2 = crypto.createHash('md5').update(`${input}${i}`).digest('hex')
        console.log(`${found}: ${ni} -> ${i} | ${h1} -> ${h2} (${triple})`);
      }
    }
  }
}

console.log({ ni });

console.log(`${hrTime() - start}µs`);