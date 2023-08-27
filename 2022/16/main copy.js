const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const valves = {};
const r = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([\w\s,]+)/;
input.split('\n').forEach((line) => {
    const [_, label, rate, edges] = r.exec(line);
    valves[label] = {
        rate: parseInt(rate),
        edges: edges.split(', '),
    };
});

let start_key = to_key('AA', new Set());
const values = { [start_key]: [0, 0, 0, 30, ''] };
const queue = new Set([start_key]);
let max_flow = 0;
let actual_valve_count = Object.keys(valves).filter((v) => {
    return valves[v].rate > 0;
}).length;
console.log(`actual_valve_count`, actual_valve_count);
while(queue.size) {
    const q = Array.from(queue);
    q.sort((a, b) => {
        return values[a][0] > values[b][0] ? 1 : -1;
        // const [a_flow, a_min] = a;
        // const [b_flow, b_min] = b;
        // return (a_flow == b_flow) ?
        //     a_min > b_min ? -1 : 1 :
        //     a_flow > b_flow ? -1 : 1;
    });
    // console.log(q);
    const key = q.pop();
    queue.delete(key);
    const [pos, opened] = from_key(key);
    const [_, flow, rate, min, path] = values[key];
    if(min === 0 || opened.size === actual_valve_count) {
        const new_flow = flow + (rate * min);
        // console.log(`found it: ${score}`);
        if(new_flow > max_flow) {
            max_flow = new_flow;
            console.log(`new max flow: ${max_flow}`);
            console.log(path);
        }
    } else { 
        const v = valves[pos];
        if(v.rate > 0 && !opened.has(pos)) {
            // gen open valve key
            const new_opened = new Set(opened);
            new_opened.add(pos);
            const new_key = to_key(pos, new_opened);
            // calc open valve score
            const new_flow = flow + rate;
            const new_rate = rate + v.rate;
            const new_min = min - 1;
            const new_score = new_flow + new_rate * new_min;
            const new_path = `${path}:[${pos}]{${new_flow}:${new_rate}}`;
            // push open valve if better
            if(!values[new_key] || new_score > values[new_key][0]) {
                // if(!values[new_key]) console.log(`new key ${new_key}: ${[new_score, new_flow, new_rate, new_min]}`);
                // else console.log(`update key ${new_key}: ${[new_score, new_flow, new_rate, new_min]} > ${values[new_key]}`);
                values[new_key] = [new_score, new_flow, new_rate, new_min, new_path];
                queue.add(new_key);
            }
        }
        v.edges.forEach((e) => {
            // gen move key
            const new_key = to_key(e, opened);
            // calc move score
            const new_flow = flow + rate;
            const new_rate = rate;
            const new_min = min - 1;
            const new_score = new_flow + new_rate * new_min;
            const new_path = `${path}:${e}{${new_flow}:${new_rate}}`;
            // push move if better
            if(!values[new_key] || new_score > values[new_key][0]) {
                // if(!values[new_key]) console.log(`new key ${new_key}: ${[new_score, new_flow, new_rate, new_min]}`);
                // else console.log(`update key ${new_key}: ${[new_score, new_flow, new_rate, new_min]} > ${values[new_key]}`);
                values[new_key] = [new_score, new_flow, new_rate, new_min, new_path];
                queue.add(new_key);
            }
        });
    }
}
console.log(`part 1: ${max_flow}`);

function to_key(pos, valves) {
    return `${pos}|${Array.from(valves).sort().join(':')}`;
}

function from_key(key) {
    const [pos, valves_str] = key.split('|');
    const valves = (valves_str === '') ?
        new Set() : new Set(valves_str.split(':'));
    return [pos, valves];
}