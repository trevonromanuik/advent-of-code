const fs = require('fs');
const path = require('path');

const debug = true;
const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const queue = [];
const monkeys = input.split('\n').reduce((acc, line) => {
  const [name, v] = line.trim().split(': ');
  const n = parseInt(v);
  if(isNaN(n)) {
    const [l, op, r] = v.split(' ');
    acc[name] = { l, op, r };
  } else {
    acc[name] = { n };
    if(name !== 'humn') {
      queue.push(name);
    }
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
// if(debug) console.log(dependents);

const values = Object.keys(monkeys).reduce((acc, name) => {
  acc[name] = NaN;
  return acc;
}, {});

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
    }
  }
  // yell
  // if(debug) console.log(name, monkey.n);
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

// if(debug) console.log(values);

let v = isNaN(values[monkeys.root.l]) ? values[monkeys.root.r] : values[monkeys.root.l];
let child_name = isNaN(values[monkeys.root.l]) ? monkeys.root.l : monkeys.root.r;
while(child_name !== 'humn') {
  if(debug) console.log(child_name, values[child_name], monkeys[child_name], v);
  const child = monkeys[child_name];
  const is_l = isNaN(values[child.l]);
  const n = is_l ? values[child.r] : values[child.l];
  child_name = is_l ? child.l : child.r;
  switch(child.op) {
    case '+':
        if(debug) console.log(`\t${v} - ${n} = ${v - n}`);
        v -= n;
        break;
      case '-':
        if(is_l) {
          if(debug) console.log(`\t${v} + ${n} = ${v + n}`);
          v += n;
        } else {
          if(debug) console.log(`\t${n} - ${v} = ${n - v}`);
          v = n - v;
        }
        break;
      case '/':
        if(is_l) {
          if(debug) console.log(`\t${v} * ${n} = ${v * n}`);
          v *= n;
        } else {
          if(debug) console.log(`\t${n} / ${v} = ${n / v}`);
          v = n / v;
        }
        break;
      case '*':
        if(debug) console.log(`\t${v} / ${n} = ${v / n}`);
        v /= n;
        break;
  }
}
console.log(v);

