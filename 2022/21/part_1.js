const fs = require('fs');
const path = require('path');

const debug = false;
const input = fs.readFileSync(path.resolve(__dirname, "./test_input2.txt"), 'utf-8');

const queue = [];
const monkeys = input.split('\n').reduce((acc, line) => {
  const [name, v] = line.trim().split(': ');
  const n = parseInt(v);
  if(isNaN(n)) {
    const [l, op, r] = v.split(' ');
    acc[name] = { l, op, r };
  } else {
    acc[name] = { n };
    queue.push(name);
  }
  return acc;
}, {});

const dependents = Object.keys(monkeys).reduce((acc, name) => {
  const monkey = monkeys[name];
  if(isNaN(monkey.n)) {
    if(!acc[monkey.l]) acc[monkey.l] = [name];
    else acc[monkey.l].push(name);
    if(!acc[monkey.r]) acc[monkey.r] = [name];
    else acc[monkey.r].push(name);
  }
  return acc;
}, {});
if(debug) console.log(dependents);

const values = {};
while(queue.length) {
  const name = queue.shift();
  const monkey = monkeys[name];
  if(isNaN(monkey.n)) {
    const ln = values[monkey.l];
    const rn = values[monkey.r];
    switch(monkey.op) {
      case '+':
        monkey.n = ln + rn;
        break;
      case '-':
        monkey.n = ln - rn;
        break;
      case '/':
        monkey.n = ln / rn;
        break;
      case '*':
        monkey.n = ln * rn;
        break;
      case '=':
        console.log(`${ln} === ${rn}`);
        break;
    }
  }
  // yell
  if(debug) console.log(name, monkey.n);
  values[name] = monkey.n;
  // check for dependents
  if(dependents[name]) {
    dependents[name].forEach((name) => {
      const dependent = monkeys[name];
      if(!isNaN(values[dependent.l]) && !isNaN(values[dependent.r])) {
        queue.push(name);
      }
    });
  }
}

if(debug) console.log(values);
console.log(values.root);