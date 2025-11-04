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

const R = new RegExp(/^(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)$/);
const ingredients = input.replaceAll('\r', '').split('\n').reduce((ingredients, line) => {
  const [_s, n, c, d, f, t, k] = R.exec(line);
  ingredients[n] = [c, d, f, t, k].map((n) => parseInt(n));
  return ingredients;
}, {});
const names = Object.keys(ingredients);

console.log(ingredients);

let max_bucket, max_score = -Infinity;
function fill(bucket, capacity, depth) {
  if (depth === names.length) {
    const scores = { c: 0, d: 0, f: 0, t: 0 };
    for (let i = 0; i < names.length ; i++) {
      const n = names[i];
      const m = bucket[n];
      const [c, d, f, t] = ingredients[n];
      scores.c += c * m;
      scores.d += d * m;
      scores.f += f * m;
      scores.t += t * m;
    }
    const score = Object.values(scores).reduce((score, s) => {
      return score * (s < 0 ? 0 : s);
    }, 1);
    // console.log({ scores, score });
    if (score > max_score) {
      max_bucket = bucket;
      max_score = score;
    }
  } else if (depth === names.length - 1) {
    fill({ ...bucket, [names[depth]]: capacity }, 0, depth + 1);
  } else {
    for (let i = 0; i < capacity; i++) {
      fill({ ...bucket, [names[depth]]: i }, capacity - i, depth + 1);
    }
  }
}
fill({}, 100, 0);

console.log({ max_score, max_bucket });

console.log(`${hrTime() - start}µs`);