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

const ops = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split(' ');
});

const registers = { a: 0, b: 0, c: 0, d: 0 };
for (let i = 0; i < ops.length; i++) {
  const op = ops[i];
  switch (op[0]) {
    case 'cpy': {
      const n = registers.hasOwnProperty(op[1]) ? registers[op[1]] : parseInt(op[1]);
      registers[op[2]] = n;
      break;
    }
    case 'inc': {
      registers[op[1]]++;
      break;
    }
    case 'dec': {
      registers[op[1]]--;
      break;
    }
    case 'jnz': {
      const n = registers.hasOwnProperty(op[1]) ? registers[op[1]] : parseInt(op[1]);
      if (n !== 0) i += parseInt(op[2]) - 1;
      break;
    }
  }
}

console.log({ registers });

console.log(`${hrTime() - start}µs`);