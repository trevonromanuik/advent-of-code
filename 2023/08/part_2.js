const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input2.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

const sections = input.split('\n\n');
const moves = sections[0];
const mappings = sections[1].split('\n').reduce((acc, line) => {
    const split = line.split(' = ');
    const [l, r] = split[1].split(', ');
    acc[split[0]] = [l.substring(1), r.substring(0, 3)];
    return acc;
}, {});

const loops = Object.keys(mappings).filter(key => key.endsWith('A')).map((key) => {
    const seen = { [`${key}:0`]: 0 };
    const start = key;
    const z_steps = [];
    let steps = 0;
    let set_key;
    do {
        key = mappings[key][moves[steps % moves.length] === 'L' ? 0 : 1];
        steps++;
        set_key = `${key}:${steps % moves.length}`;
        if (seen[set_key] !== undefined) break;
        seen[set_key] = steps;
        if (key.endsWith('Z')) z_steps.push(steps);
    } while (true);
    return {
        key: start,
        z_steps: z_steps.map(n => n - seen[set_key]),
        loop_start: seen[set_key],
        loop_length: steps - seen[set_key],
    };
}).sort((a, b) => {
    return a.loop_length > b.loop_length ? -1 : 1;
});
if (debug) console.log(loops);

let n = 0;
let answer = null;
const main_loop = loops.shift();
while (!answer) {
    for (let i = 0; i < main_loop.z_steps.length; i++) {
        const step = main_loop.loop_start + (n * main_loop.loop_length) + main_loop.z_steps[i];
        if (loops.every(({ z_steps, loop_start, loop_length }) => {
            const s = (step - loop_start) % loop_length;
            return z_steps.includes(s);
        })) {
            answer = step;
            break;
        }
    }
    n++;
}
console.log(answer);
console.log(`${Date.now() - start}ms`);