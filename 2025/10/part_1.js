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

const sum = input.replaceAll('\r', '').split('\n').reduce((sum, line) => {
  const split = line.split(' ');
  const target_string = split.shift();
  const target_key = target_string.substring(1, target_string.length - 1);
  split.pop();
  const moves = split.map((chunk) => {
    return chunk.substring(1, chunk.length - 1).split(',').map(n => parseInt(n));
  });

  const start_state = new Array(target_key.length).fill(false);
  const start_key = start_state.map(b => b ? '#' : '.').join('');
  const nodes = {
    [start_key]: {
      state: start_state,
      cost: 0,
    },
  };

  const q = [start_key];
  while (q.length) {
    const k = q.shift();
    const { state, cost } = nodes[k];
    for (let i = 0; i < moves.length; i++) {
      const new_state = [...state];
      for (let j = 0; j < moves[i].length; j++) {
        new_state[moves[i][j]] = !new_state[moves[i][j]];
      }
      const new_key = new_state.map(b => b ? '#' : '.').join('');
      const new_cost = cost + 1;
      if (nodes[new_key]) continue;
      if (new_key === target_key) {
        return sum + new_cost;
      }
      nodes[new_key] = {
        state: new_state,
        cost: new_cost,
      };
      q.push(new_key);
    }
  }
}, 0);

console.log({ sum });

console.log(JSON.stringify(summary(start)));