const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

const card_values = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reduce((acc, c, i) => {
    acc[c] = i;
    return acc;
}, {});

const hand_type_values = ['FIVE_OF_A_KIND', 'FOUR_OF_A_KIND', 'FULL_HOUSE', 'THREE_OF_A_KIND', 'TWO_PAIR', 'ONE_PAIR', 'HIGH_CARD'].reduce((acc, s, i) => {
    acc[s] = i;
    return acc;
}, {});

const hands = input.split('\n').map((line) => {
    const split = line.split(' ');
    const hand = split[0];
    const counts = hand.split('').reduce((acc, c) => {
        !!acc[c] ? acc[c]++ : acc[c] = 1;
        return acc;
    }, {});
    const keys = Object.keys(counts).sort((a, b) => {
        return counts[a] < counts[b] ? 1 : -1;
    });
    if (keys.length > 1 && counts['J']) {
        keys.splice(keys.indexOf('J'), 1);
        counts[keys[0]] += counts['J'];
        delete counts['J'];
    }
    let hand_type;
    if (keys.length === 1) {
        hand_type = 'FIVE_OF_A_KIND';
    } else if (keys.length === 2) {
        if (counts[keys[0]] === 4) {
            hand_type = 'FOUR_OF_A_KIND';
        } else {
            hand_type = 'FULL_HOUSE';
        }
    } else if (keys.length === 3) {
        if (counts[keys[0]] === 3) {
            hand_type = 'THREE_OF_A_KIND';
        } else {
            hand_type = 'TWO_PAIR';
        }
    } else if (keys.length === 4) {
        hand_type = 'ONE_PAIR';
    } else {
        hand_type = 'HIGH_CARD';
    }
    const bid = parseInt(split[1]);
    return { hand_type, hand, bid };
}).sort((a, b) => {
    if (a.hand_type === b.hand_type) {
        for (let i = 0; i < a.hand.length; i++) {
            if (a.hand[i] === b.hand[i]) continue;
            return card_values[a.hand[i]] < card_values[b.hand[i]] ? 1 : -1;
        }
    } else {
        return hand_type_values[a.hand_type] < hand_type_values[b.hand_type] ? 1 : -1;
    }
});
if (debug) {
    hands.forEach(({ hand, hand_type, bid }, i) => {
        console.log(`${i + 1}: ${hand} - ${hand_type} - ${bid}`);
    });
}
const sum = hands.reduce((sum, hand, i) => {
    return sum + (hand.bid * (i + 1));
}, 0);
console.log(sum);
console.log(`${Date.now() - start}ms`);