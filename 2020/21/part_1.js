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
console.log(JSON.stringify(allergens_to_ingredients, (key, value) => {
    if (value instanceof Set) return `(${[...value].join(', ')})`;
    return value;
}));
const bad_ingredients = new Set();
Object.values(allergens_to_ingredients).forEach((ingredients) => {
    ingredients.forEach((ingredient) => bad_ingredients.add(ingredient));
});
const count = foods.reduce((count, { ingredients }) => {
    return count + ingredients.filter((ingredient) => {
        return !bad_ingredients.has(ingredient);
    }).length;
}, 0);

console.log({ count });

console.log(`${hrTime() - start}µs`);