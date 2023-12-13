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

const sum = input.split('\n').reduce((sum, line) => {

    if (debug) console.log(line);
    const split = line.split(' ');
    const row = split[0];
    const expected_group_counts = split[1].split(',').map(n => parseInt(n));

    const q = [{
        row: row,
        i: 0,
        cur_group_count: 0,
        group_counts: []
    }];

    let count = 0;
    while (q.length) {
        let { row, i, cur_group_count, group_counts } = q.pop();
        let expected_group_count = expected_group_counts[group_counts.length] || 0;
        for (i; i < row.length; i++) {
            if (row[i] === '?') {
                if (cur_group_count < expected_group_count) {
                    // can be #
                    q.push({
                        row: row.substring(0, i) + '#' + row.substring(i + 1),
                        i: i,
                        cur_group_count: cur_group_count,
                        group_counts: [...group_counts],
                    });
                }
                if (cur_group_count === 0 || cur_group_count === expected_group_count) {
                    // can be .
                    q.push({
                        row: row.substring(0, i) + '.' + row.substring(i + 1),
                        i: i,
                        cur_group_count: cur_group_count,
                        group_counts: [...group_counts],
                    });
                }
                break;
            } else if (row[i] === '#') {
                cur_group_count++;
                if (cur_group_count > expected_group_count) break;
            } else if (row[i] === '.') {
                if (cur_group_count > 0) {
                    if (cur_group_count < expected_group_count) break;
                    group_counts.push(cur_group_count);
                    cur_group_count = 0;
                    expected_group_count = expected_group_counts[group_counts.length] || 0;
                }
            }
        }
        if (i === row.length) {
            if (cur_group_count > 0) group_counts.push(cur_group_count);
            if (expected_group_counts.every((n, i) => {
                return group_counts[i] === n;
            })) {
                if (debug) console.log('  ', row, group_counts);
                count++;
            }
        }
    }
    if (debug) console.log('  ', count);
    return sum + count;
}, 0);
console.log(sum);
console.log(`${hrTime() - start}µs`);