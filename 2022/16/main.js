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

const valve_keys = new Set(Object.keys(valves).filter((v) => {
    return valves[v].rate > 0;
}));

const distances = {};
const room_keys = Array.from(valve_keys);
room_keys.push("AA");
for(let i = 0; i < room_keys.length; i++) {
    const key = room_keys[i];
    const queue = [key];
    const my_distances = { [key]: 0 };
    while(queue.length) {
        const k = queue.pop();
        const d = my_distances[k];
        valves[k].edges.forEach((e) => {
            if(!my_distances[e] || (d + 1) < my_distances[e]) {
                my_distances[e] = d + 1;
                queue.push(e);
            }
        });
    }
    distances[key] = {};
    valve_keys.forEach((v) => {
        distances[key][v] = my_distances[v];
    })
}

(function part_1() {
    const start = new Date();
    const queue = [['AA', 0, 0, 30, new Set(valve_keys), '']];
    let max_flow = 0;
    let max_path = null;
    while(queue.length) {
        const [pos, flow, rate, min, vks, path] = queue.pop();
        // console.log([pos, flow, rate, min, set_to_string(vks), path]);
        if(Array.from(vks).filter((v) => {
            const d = distances[pos][v] + 1;
            // console.log(` testing ${v} - ${d}`);
            if(d <= min) {
                // console.log(`  ${d} <= ${min}`);
                const new_flow = flow + (rate * d);
                const new_rate = rate + valves[v].rate;
                const new_min = min - d;
                const new_vks = new Set(vks);
                new_vks.delete(v);
                const new_path = `${path}:${v}`;
                queue.push([v, new_flow, new_rate, new_min, new_vks, new_path]);
                // console.log(`  pushing ${[v, new_flow, new_rate, new_min, set_to_string(new_vks), new_path]}`);
                return true;
            }
        }).length === 0) {
            // opened last valve - just wait remaning minutes
            const new_flow = flow + (rate * min);
            if(new_flow > max_flow) {
                max_flow = new_flow;
                max_path = path;
                // console.log(`new max_flow: ${max_flow} - ${path}`);
            }
        }
    }
    console.log(`part 1: ${max_flow} - ${Date.now() - start}`);
    console.log(max_path);
})();

(function part_2() {
    const start = Date.now();
    const minutes = 26;
    const queue = [['AA', 0, 0, minutes, new Set(valve_keys), '', false]];
    let max_flow = 0;
    let max_path = null;
    while(queue.length) {
        const [pos, flow, rate, min, vks, path, is_second] = queue.pop();
        // console.log([pos, flow, rate, min, set_to_string(vks), path]);
        // console.log(pos, path);
        // add the elephant
        if(!is_second) {
            const new_flow = flow + (rate * min);
            queue.push(['AA', new_flow, 0, minutes, new Set(vks), `${path}:::`, true]);
        }
        if(Array.from(vks).filter((v) => {
            const d = distances[pos][v] + 1;
            // console.log(` testing ${v} - ${d}`);
            if(d <= min) {
                // console.log(`  ${d} <= ${min}`);
                const new_flow = flow + (rate * d);
                const new_rate = rate + valves[v].rate;
                const new_min = min - d;
                const new_vks = new Set(vks);
                new_vks.delete(v);
                const new_path = `${path}:${v}`;
                queue.push([v, new_flow, new_rate, new_min, new_vks, new_path, is_second]);
                // console.log(`  pushing ${[v, new_flow, new_rate, new_min, set_to_string(new_vks), new_path]}`);
                return true;
            }
        }).length === 0) {
            // opened last valve - just wait remaning minutes
            const new_flow = flow + (rate * min);
            if(is_second) {
                if(new_flow > max_flow) {
                    max_flow = new_flow;
                    max_path = path;
                    // console.log(`new max_flow: ${max_flow} - ${path}`);
                }
            } else {
                // start the elephant with the remaining valves

            }
        }
    }
    console.log(`part 2: ${max_flow} - ${Date.now() - start}`);
    console.log(max_path);
})();

function set_to_string(set) {
    return `(${Array.from(set).sort().join(',')})`;
}