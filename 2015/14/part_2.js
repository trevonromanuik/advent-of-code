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

const SECONDS = test ? 1000 : 2503;

const R = new RegExp(/^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/)
const reindeer = input.replaceAll('\r', '').split('\n').reduce((reindeer, line) => {
  const r = R.exec(line);
  const [_s, n, sp, ft, rt] = r;
  reindeer[n] = {
    sp: parseInt(sp),
    ft: parseInt(ft),
    rt: parseInt(rt),
    rmt: parseInt(ft),
    f: true,
    d: 0,
    p: 0
  };
  return reindeer;
}, {});
const names = Object.keys(reindeer);

for (let i = 0; i < SECONDS; i++) {
  let max_names = [], max_distance = -Infinity;
  for (let j = 0; j < names.length; j++) {
    const r = reindeer[names[j]];
    if (r.f) r.d += r.sp;
    r.rmt -= 1;
    if (r.rmt === 0) {
      r.f = !r.f;
      r.rmt = r.f ? r.ft : r.rt;
    }
    if (r.d > max_distance) {
      max_names = [names[j]];
      max_distance = r.d;
    } else if (r.d === max_distance) {
      max_names.push(names[j]);
    }
  }
  for (let j = 0; j < max_names.length; j++) {
    reindeer[max_names[j]].p += 1;
  }
  // console.log(i, max_names);
}

let max_name, max_points = -Infinity;
for (let j = 0; j < names.length; j++) {
  const r = reindeer[names[j]];
  // console.log(names[j], r.p);
  if (r.p > max_points) {
    max_name = names[j];
    max_points = r.p;
  }
}

console.log({ max_name, max_points });

console.log(`${hrTime() - start}µs`);