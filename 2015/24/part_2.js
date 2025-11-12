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

const weights = input.replaceAll('\r', '').split('\n').map((line) => {
  return parseInt(line);
});
console.log({ weights });

const total_weight = weights.reduce((sum, n) => {
  return sum + n;
});
const target_weight = total_weight / 4;
console.log({ total_weight, target_weight });

const all_sets = [];
const q = [[[...weights], [], 0]];
while (q.length) {
  const [ws, g, w] = q.pop();
  while (ws.length) {
    const wi = ws.pop();
    const new_w = w + wi;
    if (new_w === target_weight) {
      const new_g = [...g, wi];
      all_sets.push([
        new Set(new_g),
        new_g.reduce((p, n) => {
          return p * n;
        }),
      ]);
      continue;
    }
    if (new_w > target_weight) {
      continue;
    }
    q.push([[...ws], [...g, wi], new_w]);
  }
}

all_sets.sort(([sa, qea], [sb, qeb]) => {
  return sa.size === sb.size ?
    qea < qeb ? -1 : 1 :
    sa.size < sb.size ? -1 : 1;
});

if (test) {
  all_sets.forEach(([s, qe]) => {
    console.log(s, qe);
  });
}

let best_s = null;
let best_qe = null;
const all_weights = new Set(weights);
for (let i = 0; i < all_sets.length; i++) {
  if (best_s) break;
  const [s1, qe] = all_sets[i];
  const r1 = all_weights.difference(s1);
  for (let j = i + 1; j < all_sets.length; j++) {
    if (best_s) break;
    const [s2,] = all_sets[j];
    if (!s2.isSubsetOf(r1)) continue;
    const r2 = r1.difference(s2);
    for (let k = j + 1; k < all_sets.length; k++) {
      if (best_s) break;
      const [s3,] = all_sets[k];
      if (!s3.isSubsetOf(r2)) continue;
      const r3 = r2.difference(s3);
      if (r3.values().reduce((sum, n) => {
        return sum + n;
      }) === target_weight) {
        console.log(s1, s2, s3, r3, qe);
        best_s = s1;
        best_qe = qe;
        break;
      }
    }
  }
}

console.log({ best_s, best_qe });

console.log(`${hrTime() - start}µs`);