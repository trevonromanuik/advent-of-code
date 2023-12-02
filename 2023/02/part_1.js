const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const bag = {
  red: 12,
  green: 13,
  blue: 14,
};

const sum = input.split('\n').reduce((sum, line, i) => {
  if (!line) return sum;
  const game = line.split('; ');
  let valid = true;
  for (let j = 0; j < game.length; j++) {
    if (!valid) break;
    const round = (j === 0) ?
        game[j].substring(7 + (i + 1).toString().length) :
        game[j];
    const cubes = round.split(', ');
    for(let k = 0; k < cubes.length; k++) {
      const [n, c] = cubes[k].split(' ');
      if (parseInt(n) > bag[c]) {
        console.log({ c, n, b: bag[c] });
        valid = false;
        break;
      }
    }
  }
  if (debug) console.log(`Game ${i + 1}: ${valid}`);
  if (valid) sum += (i + 1);
  return sum;
}, 0);
console.log(sum);