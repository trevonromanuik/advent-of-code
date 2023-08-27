const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const monkeys = input.split('\n\n').map((chunk) => {
    const lines = chunk.split('\n');
    return {
        inspects: 0,
        items: lines[1].substring(18).split(", ").map((n) => parseInt(n)),
        op: lines[2].substring(23, 24),
        op_n: parseInt(lines[2].substring(25)),
        div: parseInt(lines[3].substring(21)),
        if_true: parseInt(lines[4].substring(29)),
        if_false: parseInt(lines[5].substring(30)),
    };
});

const product = monkeys.map(monkey => monkey.div).reduce((product, n) => product * n);
console.log(product);

const rounds = 10000;
for (let round = 0; round < rounds; round++) {
    monkeys.forEach((monkey, i) => {
        // console.log(`Monkey ${i}:`);
        monkey.inspects += monkey.items.length;
        monkey.items.forEach((item) => {
            // console.log(`  Monkey inspects an item with a worry level of ${item}.`);
            const n = isNaN(monkey.op_n) ? item : monkey.op_n;
            switch(monkey.op) {
                case '*': {
                    item *= n;
                    // console.log(`    Worry level is multiplied by ${n} to ${item}.`);
                    break;
                }
                case '+': {
                    item += n;
                    // console.log(`    Worry level increases by ${n} to ${item}.`);
                    break;
                }
            }
            // item = Math.floor(item / 3);
            // console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${item}.`);
            let target;
            if(item % monkey.div === 0) {
                // console.log(`    Current worry level is divisible by ${monkey.div}.`);
                target = monkey.if_true;
            } else {
                // console.log(`    Current worry level is not divisible by ${monkey.div}.`);
                target = monkey.if_false
            }
            // console.log(`    Item with worry level ${item} is thrown to monkey ${target}.`);
            monkeys[target].items.push(item % product);
        });
        monkey.items = [];
    });
    if((round === 0) || ((round + 1) % 1000 === 0)) {
        console.log(``);
        console.log(`== After round ${round + 1} ==`);
        monkeys.forEach((monkey, i) => {
            console.log(`Monkey ${i}: ${monkey.items.join(', ')}`);
        });
    }
}

console.log(``);
monkeys.forEach((monkey, i) => {
    console.log(`Monkey ${i} inspected items ${monkey.inspects} times.`);
});
console.log(``);

let scores = monkeys.map(monkey => monkey.inspects).sort((a, b) => {
    return b - a;
});
console.log(`part 1: ${scores[0] * scores[1]}`);