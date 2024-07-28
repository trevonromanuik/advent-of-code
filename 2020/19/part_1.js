const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function hrTime() {
    const t = process.hrtime();
    return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const [rules_input, lines_input] = input.split('\n\n');

const rules = rules_input.split('\n').reduce((rules, line) => {
    const [rule_id, rule_value] = line.split(': ');
    if(rule_value[0] === '"') {
        rules[rule_id] = {
            values: [rule_value.substring(1, rule_value.indexOf('"', 1))],
        };
    } else {
        rules[rule_id] = {
            rules: rule_value.split(' | ').map((s) => {
                return s.split(' ').map((n) => parseInt(n));
            }),
        };
    }
    return rules;
}, {});

// console.log(rules);

function evaluate(rule_id) {
    if(!rules[rule_id].values) {
        rules[rule_id].values = rules[rule_id].rules.map((rule) => {
            return rule.map((rule_id) => evaluate(rule_id)).reduce((ls, rs) => {
                const values = new Array(ls.length * rs.length);
                let i = 0;
                for(const l of ls) {
                    for(const r of rs) {
                        values[i] = l + r;
                        i++;
                    }
                }
                return values;
            });
        }).flat();
        // console.log(rule_id, rules[rule_id].values);
    }
    return rules[rule_id].values;
}

const values = evaluate('0').reduce((map, v) => {
    map[v] = true;
    return map;
}, {});

const sum = lines_input.split('\n').reduce((sum, line) => {
    if(values[line]) sum++;
    return sum;
}, 0);

console.log({ sum });

console.log(`${hrTime() - start}µs`);