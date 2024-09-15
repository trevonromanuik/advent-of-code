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

function intersection(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
}

const allergens_to_ingredients = {};
const foods = input.replaceAll('\r', '').split('\n').map((line) => {
    const index = line.indexOf('(');
    const ingredients = line.substring(0, index - 1).split(' ');
    const allergens = line.substring(index + 10, line.length - 1).split(', ');
    allergens.forEach((allergen) => {
        if (allergens_to_ingredients[allergen]) {
            const old_set = allergens_to_ingredients[allergen];
            const new_set = new Set(ingredients);
            allergens_to_ingredients[allergen] = intersection(old_set, new_set);
        } else {
            allergens_to_ingredients[allergen] = new Set(ingredients);
        }
    });
    return { ingredients, allergens };
});

const set_replacer = (key, value) => {
    if (value instanceof Set) return `(${[...value].join(', ')})`;
    return value;
};

console.log(JSON.stringify(allergens_to_ingredients, set_replacer));

done = false;
const known_allergens = new Set();
while(!done) {
    done = true;
    Object.keys(allergens_to_ingredients).sort((a, b) => {
        return allergens_to_ingredients[a].size < allergens_to_ingredients[b].size ? -1 : 1;
    }).forEach((allergen) => {
        if (allergens_to_ingredients[allergen].size > 1) {
            known_allergens.forEach((ingredient) => {
                allergens_to_ingredients[allergen].delete(ingredient);
            });
        }
        if (allergens_to_ingredients[allergen].size === 1) {
            known_allergens.add([...allergens_to_ingredients[allergen]][0]);
        } else {
            done = false;
        }
    });
    console.log(JSON.stringify(known_allergens, set_replacer));
    console.log(JSON.stringify(allergens_to_ingredients, set_replacer));
}

const s = Object.keys(allergens_to_ingredients).sort().map((allergen) => {
    return [...allergens_to_ingredients[allergen]][0];
}).join(',');
console.log({ s });

console.log(`${hrTime() - start}µs`);