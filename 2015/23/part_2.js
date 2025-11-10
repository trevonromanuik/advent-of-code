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

const instructions = input.replaceAll('\r', '').split('\n').map((line) => {
  const split = line.split(' ');
  switch (split[0]) {
    case 'jmp':
      split[1] = parseInt(split[1]);
      break;
    case 'jie':
    case 'jio':
      split[1] = split[1][0];
      split[2] = parseInt(split[2]);
      break;
  }
  return split;
});

const registers = { a: 1, b: 0 };
let i = 0;
while (i > -1 && i < instructions.length) {
  const instruction = instructions[i];
  switch (instruction[0]) {
    case 'hlf':
      registers[instruction[1]] = Math.floor(registers[instruction[1]] / 2);
      i++;
      break;
    case 'tpl':
      registers[instruction[1]] = registers[instruction[1]] * 3;
      i++;
      break;
    case 'inc':
      registers[instruction[1]] = registers[instruction[1]] + 1;
      i++;
      break;
    case 'jmp':
      i += instruction[1];
      break;
    case 'jie':
      if (registers[instruction[1]] % 2 === 0) {
        i += instruction[2];
      } else {
        i++;
      }
      break;
    case 'jio':
      if (registers[instruction[1]] === 1) {
        i += instruction[2];
      } else {
        i++;
      }
      break;
  }
}

console.log({ registers });

console.log(`${hrTime() - start}µs`);