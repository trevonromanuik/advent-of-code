const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function summary(start) {
  const time = `${hrTime() - start}µs`;
  const usage = memoryUsage();
  usage['time'] = time;
  return usage;
}

function memoryUsage() {
  const usage = process.memoryUsage();
  Object.keys(usage).forEach((key) => {
    usage[key] = `${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`
  });
  return usage;
}

function hrTime() {
  const t = process.hrtime();
  return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const [ranges_chunk, ids_chunk] = input.replaceAll('\r', '').split('\n\n');
const raw_ranges = ranges_chunk.split('\n').map((line) => {
  return line.split('-').map(n => parseInt(n));
});
raw_ranges.sort((a, b) => {
  return a[0] === b[0] ?
    a[1] < b[1] ? -1 : 1 :
    a[0] < b[0] ? -1 : 1;
});
const ranges = raw_ranges.reduce((ranges, range) => {
  if (!ranges.length) {
    ranges.push(range);
  } else {
    const prev_range = ranges[ranges.length - 1];
    if (range[0] <= prev_range[1]) {
      if (range[1] > prev_range[1]) {
        prev_range[1] = range[1];
      }
    } else {
      ranges.push(range);
    }
  }
  return ranges;
}, []);

const count = ids_chunk.split('\n').reduce((count, line) => {
  const n = parseInt(line);
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (n > range[1]) continue;
    if (n >= range[0]) {
      // console.log(n, true);
      count++;
    } else {
      // console.log(n, false);
    }
    break;
  }
  return count;
}, 0);

console.log({ count });

console.log(JSON.stringify(summary(start)));