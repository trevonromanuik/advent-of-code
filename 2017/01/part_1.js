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

input.replaceAll('\r', '').split('\n').forEach((line) => {
  let sum = 0;
  for (let i = 0; i < line.length; i++) {
    let j = (i + 1) % line.length;
    if (line[i] === line[j]) sum += parseInt(line[i]);
  }
  console.log(sum, line);
});

console.log(JSON.stringify(summary(start)));