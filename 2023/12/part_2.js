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

const start = hrTime();
const sum = input.split('\n').reduce((sum, line, r) => {

    if (debug) console.log(line);
    const split = line.split(' ');
    const row = new Array(5).fill(split[0]).join('?');
    const expected_group_counts = new Array(5).fill(split[1]).join(',').split(',').map(n => parseInt(n));

    const counts = {};
    function solve(row, group_counts, cur_count) {
        const key = `${row}:${group_counts}:${cur_count}`;
        if (!(key in counts)) {
            // console.log('', key);
            for (let i = 0; i < row.length; i++) {
                if (group_counts.length === 0) {
                    const index = row.indexOf('#', i);
                    counts[key] = index === -1 ? 1 : 0;
                    break;
                } else if (row[i] === '?') {
                    const sub = row.substring(i + 1);
                    counts[key] =
                        solve(`.${sub}`, [...group_counts], cur_count) +
                        solve(`#${sub}`, [...group_counts], cur_count);
                    break;
                } else if (row[i] === '#') {
                    cur_count++;
                    if(cur_count > group_counts[0]) {
                        counts[key] = 0;
                        break;
                    }
                } else if (row[i] === '.') {
                    if (cur_count > 0) {
                        if (cur_count < group_counts[0]) {
                            counts[key] = 0;
                            break;
                        }
                        group_counts.shift();
                        cur_count = 0;
                    }
                }
            }
            if (!(key in counts)) {
                if (group_counts.length > 1 || cur_count !== (group_counts[0] || 0)) {
                    counts[key] = 0;
                } else {
                    counts[key] = 1;
                }
            }
        }
        return counts[key];
    }

    const count = solve(row, [...expected_group_counts], 0);
    if (debug) console.log('  ', count);
    return sum + count;

}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);