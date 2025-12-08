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

const nodes = input.replaceAll('\r', '').split('\n').map((line) => {
  const [x, y, z] = line.split(',').map(n => parseInt(n));
  return { k: line, x, y, z };
});

const distances = [];
for (let i = 0; i < nodes.length; i++) {
  const ni = nodes[i];
  for (let j = i + 1; j < nodes.length; j++) {
    const nj = nodes[j];
    const d = Math.sqrt(
      Math.pow(Math.abs(ni.x - nj.x), 2) +
      Math.pow(Math.abs(ni.y - nj.y), 2) +
        Math.pow(Math.abs(ni.z - nj.z), 2)
    );
    distances.push([d, ni.k, nj.k]);
  }
}

distances.sort(([d1,], [d2,]) => {
  return d1 < d2 ? -1 : 1;
});

const N_LINKS = test ? 10 : 1000;
const circuits = [];
const circuits_map = {};
for (let i = 0; i < N_LINKS; i++) {
  [, k1, k2] = distances[i];
  if (circuits_map[k1] && circuits_map[k2]) {
    if (circuits_map[k1] !== circuits_map[k2]) {
      const circuit_map = circuits_map[k2];
      circuit_map.forEach((k) => {
        circuits_map[k1].add(k);
        circuits_map[k] = circuits_map[k1];
      });
      circuit_map.clear();
    }
  } else if (circuits_map[k1]) {
    circuits_map[k1].add(k2);
    circuits_map[k2] = circuits_map[k1];
  } else if (circuits_map[k2]) {
    circuits_map[k2].add(k1);
    circuits_map[k1] = circuits_map[k2];
  } else {
    const circuit = new Set([k1, k2]);
    circuits.push(circuit);
    circuits_map[k1] = circuit;
    circuits_map[k2] = circuit;
  }
}

circuits.sort((a, b) => {
  return a.size > b.size ? -1 : 1;
});

const p = circuits[0].size * circuits[1].size * circuits[2].size;
console.log({ p });

console.log(JSON.stringify(summary(start)));