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

const [boss_hp, boss_atk, boss_def] = input.replaceAll('\r', '').split('\n').map((line) => {
  return parseInt(line.split(': ')[1]);
});

const player_hp = 100;

const SHOP_INPUT = `
Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armor:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3
`.trim();

const [weapons, armors, rings] = SHOP_INPUT.split('\n\n').map((chunk) => {
  const lines = chunk.split('\n');
  lines.shift();
  return lines.map((line) => {
    return line.split(/\s\s+/).map((s, i) => {
      return i === 0 ? s : parseInt(s);
    });
  });
});

// console.log({ weapons });
// console.log({ armors });
// console.log({ rings });
//
// console.log({ boss_hp, boss_atk, boss_def });

let min_cost = Infinity;
let min_loadout = null;
for (let weapon_i = 0; weapon_i < weapons.length; weapon_i++) {
  const weapon = weapons[weapon_i];
  for (let armor_i = -1; armor_i < armors.length; armor_i++) {
    const armor = armor_i > -1 ? armors[armor_i] : null;
    for (let ring_i = -1; ring_i < rings.length; ring_i++) {
      const ring1 = ring_i > -1 ? rings[ring_i] : null;
      for (let ring_j = ring_i; ring_j < rings.length; ring_j++) {
        const ring2 = ring_j > -1 && ring_j !== ring_i ? rings[ring_j] : null;
        const [cost, atk, def] = [weapon, armor, ring1, ring2].reduce((out, n) => {
          if (n !== null) {
            out[0] += n[1];
            out[1] += n[2];
            out[2] += n[3];
          }
          return out;
        }, [0, 0, 0]);
        // console.log(weapon[0], armor?.[0], ring1?.[0], ring2?.[0], cost, atk, def);
        const turns_to_kill = Math.ceil(boss_hp / Math.max(1, atk - boss_def));
        const turns_to_die = Math.ceil(player_hp / Math.max(1, boss_atk - def));
        if (turns_to_kill <= turns_to_die) {
          if (cost < min_cost) {
            min_cost = cost;
            min_loadout = [weapon[0], armor?.[0], ring1?.[0], ring2?.[0]];
          }
        }
      }
    }
  }
}

console.log({ min_cost });
console.log({ min_loadout });

console.log(`${hrTime() - start}µs`);