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
  const target_string = split.pop();
  const target_key = target_string.substring(1, target_string.length - 1);
  const target = target_key.split(',').map(n => parseInt(n));
  split.shift();
  const moves = split.map((chunk) => {
    return chunk.substring(1, chunk.length - 1).split(',').map(n => parseInt(n));
  });

  // console.log({ moves, target });

  const start_used = new Set();
  const start_unused = new Set(moves.map(buttons => buttons.join(',')));
  const start_state = new Array(target.length).fill(false);
  const start_state_key = start_state.map(b => b ? '#' : '.').join('');
  const all_paths = { [start_state_key]: new Set(['']) };
  function calcPaths(used, unused, state) {
    unused.forEach((move_key) => {
      const new_used = new Set(used);
      new_used.add(move_key);
      const new_unused = new Set(unused);
      new_unused.delete(move_key);
      const new_state = [...state];
      move_key.split(',').forEach((i) => {
        i = parseInt(i);
        new_state[i] = !new_state[i];
      });
      const new_state_key = new_state.map(b => b ? '#' : '.').join('');
      const new_used_key = Array.from(new_used).sort().join('|');
      if (!all_paths[new_state_key]) all_paths[new_state_key] = new Set();
      if (!all_paths[new_state_key].has(new_used_key)) {
        all_paths[new_state_key].add(new_used_key);
        calcPaths(new_used, new_unused, new_state);
      }
    });
  }
  calcPaths(start_used, start_unused, start_state);

  const all_presses = {
    [new Array(target.length).fill(0).join(',')]: {
      cost: 0,
      moves: {},
    },
  };
  function calcPresses(joltages) {
    const joltages_key = joltages.join(',');
    if (!all_presses.hasOwnProperty(joltages_key)) {
      const target_key = joltages.map(n => n % 2 === 0 ? '.' : '#').join('');
      let min_cost = Infinity;
      let min_moves = {};
      if (all_paths.hasOwnProperty(target_key)) {
        Array.from(all_paths[target_key]).forEach((moves_key) => {
          const new_joltages = [...joltages];
          const move_keys = moves_key.split('|');
          const target_presses = moves_key === '' ? 0 : move_keys.length;
          if (moves_key !== '') {
            let shortout = false;
            move_keys.forEach((move_key) => {
              if (shortout) return;
              move_key.split(',').forEach((n) => {
                if (shortout) return;
                n = parseInt(n);
                if (isNaN(n)) return;
                new_joltages[n]--;
                if (new_joltages[n] < 0) shortout = true;
              });
            });
            if (shortout) return Infinity;
          }
          new_joltages.forEach((n, i) => {
            new_joltages[i] = n / 2;
          });
          const r = calcPresses(new_joltages);
          const new_cost = r.cost * 2 + target_presses;
          if (new_cost < min_cost) {
            const new_moves = {...r.moves};
            Object.keys(new_moves).forEach((move_key) => {
              new_moves[move_key] *= 2;
            });
            move_keys.forEach((move_key) => {
              if (move_key === '') return;
              if (!new_moves[move_key]) new_moves[move_key] = 0;
              new_moves[move_key]++;
            });
            min_cost = new_cost;
            min_moves = new_moves;
          }
        });
      }
      all_presses[joltages_key] = { cost: min_cost, moves: min_moves };
    }
    return all_presses[joltages_key];
  }
  const r = calcPresses(target);
  const rcost = r.cost;
  const rmoves = r.moves;
  // console.log({ target, rcost, rmoves });
  return sum + rcost;

}, 0);

console.log({ sum });

console.log(JSON.stringify(summary(start)));