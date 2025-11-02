const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
  const t = process.hrtime();
  return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function makeWire(p, n) {
  return `${p}${pad(n)}`;
}

const start = hrTime();

const NUM_BITS = 45;

const [_ivs_chunk, gates_chunk] = input.replaceAll('\r\n').split('\n\n');

const gates = gates_chunk.split('\n').reduce((gates, line) => {
  const [input, output] = line.split(' -> ');
  const [l, op, r] = input.split(' ');
  gates[output] = [op, [l, r]];
  return gates;
}, {});


// console.log(gates);

function runWire(output, values) {
  if (values.hasOwnProperty(output)) return values[output];
  const [op, inputs] = gates[output];
  const lv = values[inputs[0]] = runWire(inputs[0], values);
  const rv = values[inputs[1]] = runWire(inputs[1], values);
  switch (op) {
    case 'AND':
      return (lv && rv) ? 1 : 0;
    case 'OR':
      return (lv || rv) ? 1 : 0;
    case 'XOR':
      return ((lv || rv) && !(lv && rv)) ? 1 : 0;
  }
}

function checkBit(n) {
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      for (let c = 0; c < 2; c++) {
        // skip the first bit if the carry is 1
        if (n === 0 && c === 1) continue;
        const values = {};
        for (let i = 0; i < NUM_BITS; i++) {
          values[makeWire('x', i)] = i === n ? x : i === n - 1 ? c : 0;
          values[makeWire('y', i)] = i === n ? y : i === n - 1 ? c : 0;
        }
        const z = runWire(makeWire('z', n), values);
        if (z !== (x + y + c) % 2) return false;
      }
    }
  }
  return true;
}

const ALL_INPUTS = {};
function getInputs(output) {
  if (!ALL_INPUTS.hasOwnProperty[output]) {
    ALL_INPUTS[output] = new Set([output]);
    if (gates.hasOwnProperty(output)) {
      gates[output][1].forEach((input) => {
        ALL_INPUTS[output].add(input);
        if (gates.hasOwnProperty(input)) {
          ALL_INPUTS[output] = ALL_INPUTS[output].union(getInputs(input));
        }
      });
    }
  }
  return ALL_INPUTS[output];
}

function printWire(output) {
  if (!gates.hasOwnProperty(output)) return;
  const [op, inputs] = gates[output];
  console.log(`${output} = ${inputs[0]} ${op} ${inputs[1]}`);
}

function findGate(op = null, ins = null) {
  return Object.keys(gates).find((output) => {
    const [g_op, inputs] = gates[output];
    if (op && g_op !== op) return false;
    if (ins && !new Set(ins).isSubsetOf(new Set(inputs))) return false;
    return true;
  });
}

function swap(a, b) {
  const t = gates[a];
  gates[a] = gates[b];
  gates[b] = t;
}

function fixBit(n) {
  // zn = nxor XOR m1
  // nxor = xn XOR yn
  // m1 = m2 OR pevand
  // prevand = xn-1 AND yn-1
  // m2 = prevxor AND ?
  // prevxor = nx-1 XOR yn-1
  const prevand = findGate('AND', [makeWire('x', n - 1), makeWire('y', n - 1)]);
  const prevxor = findGate('XOR', [makeWire('x', n - 1), makeWire('y', n - 1)]);
  const m2 = findGate('AND', [prevxor]);
  const m1 = findGate('OR', [m2, prevand]);
  const nxor = findGate('XOR', [makeWire('x', n), makeWire('y', n)]);
  const zn = findGate('XOR', [nxor, m1]);
  let toSwap;
  if (zn == null) {
    // we did not find a matching wire for zn, which means one of the inputs is wrong
    // diff the expected inputs with the actual inputs and swap the mismatches
    toSwap = [...new Set(gates[makeWire('z', n)][1]).symmetricDifference(new Set([nxor, m1]))];
  } else {
    // we found a matching wire for zn, but it's not pointing at the right place
    toSwap = [zn, makeWire('z', n)];
  }
  swap(...toSwap);
  return toSwap;
}

let solution = [];
for (let i = 1; i < NUM_BITS; i++) {
  if (!checkBit(i)) {
    solution = solution.concat(fixBit(i));
  }
}
console.log(solution.sort().join(','));

console.log(`${hrTime() - start}µs`);