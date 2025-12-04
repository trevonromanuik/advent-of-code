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

const ops = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split(' ');
});

const registers = { a: 7, b: 0, c: 0, d: 0 };
for (let i = 0; i < ops.length; i++) {
  const op = ops[i];
  switch (op[0]) {
    case 'cpy': {
      const n = registers.hasOwnProperty(op[1]) ? registers[op[1]] : parseInt(op[1]);
      if (registers.hasOwnProperty(op[2])) registers[op[2]] = n;
      break;
    }
    case 'inc': {
      if (registers.hasOwnProperty(op[1])) registers[op[1]]++;
      break;
    }
    case 'dec': {
      if (registers.hasOwnProperty(op[1])) registers[op[1]]--;
      break;
    }
    case 'jnz': {
      const n = registers.hasOwnProperty(op[1]) ? registers[op[1]] : parseInt(op[1]);
      if (n !== 0) {
        const t = registers.hasOwnProperty(op[2]) ? registers[op[2]] : parseInt(op[2]);
        if (!isNaN(t)) i += t - 1;
      }
      break;
    }
    case 'tgl': {
      const n = registers.hasOwnProperty(op[1]) ? registers[op[1]] : parseInt(op[1]);
      const ni = i + n;
      if (ni < 0 || ni >= ops.length) continue;
      if (ops[ni].length === 2) {
        ops[ni][0] = (ops[ni][0] === 'inc') ? 'dec' : 'inc';
      } else {
        ops[ni][0] = (ops[ni][0] === 'jnz') ? 'cpy' : 'jnz';
      }
      break;
    }
  }
  if (test) console.log({ op, registers });
}

console.log({ registers });

console.log(JSON.stringify(summary(start)));