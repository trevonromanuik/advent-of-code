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

const [START_BOSS_HP, BOSS_ATK] = input.replaceAll('\r', '').split('\n').map((line) => {
  return parseInt(line.split(': ')[1]);
});

const START_HP = 50;
const START_MP = 500;

function createKey(state) {
  return state.join('|');
}

function castSpell(prev_state, spell, replay = false) {
  let [hp, mp, boss_hp, shield_turns, poison_turns, recharge_turns] = prev_state;
  if (replay) console.log('\n-- Player turn --');
  if (replay) console.log(`- Player has ${hp} hit points, ${mp} mana`);
  if (replay) console.log(`- Boss has ${boss_hp} hit points`);
  let def = 0;
  if (shield_turns > 0) {
    def = 7;
    shield_turns -= 1;
    if (replay) console.log(`Shield is active; timer is now ${shield_turns}`);
  }
  if (poison_turns > 0) {
    boss_hp -= 3;
    poison_turns -= 1;
    if (replay) console.log(`Poison deals 3 damage; timer is now ${poison_turns}`);
  }
  if (recharge_turns > 0) {
    mp += 101;
    recharge_turns -= 1;
    if (replay) console.log(`Recharge provides 101 mp; timer is now ${recharge_turns}`);
  }
  switch (spell) {
    case 0: // magic missile
      if (mp < 53) return false;
      mp -= 53;
      boss_hp -= 4;
      if (replay) console.log(`Player casts Magic Missile, dealing 4 damage`);
      break;
    case 1: // drain
      if (mp < 73) return false;
      mp -= 73;
      boss_hp -= 2;
      hp += 2;
      if (replay) console.log(`Player casts Drain, dealing 2 damage, and healing 2 hit points`);
      break;
    case 2: // shield
      if (mp < 113 || shield_turns > 0) return false;
      mp -= 113;
      shield_turns = 6;
      if (replay) console.log(`Player casts Shield`);
      break;
    case 3: // poison
      if (mp < 173 || poison_turns > 0) return false;
      mp -= 173;
      poison_turns = 6;
      if (replay) console.log(`Player casts Poison`);
      break;
    case 4: // recharge
      if (mp < 229 || recharge_turns > 0) return false;
      mp -= 229;
      recharge_turns = 5;
      if (replay) console.log(`Player casts Recharge`);
      break;
  }
  if (boss_hp > 0) {
    if (replay) console.log('\n-- Boss turn --');
    if (replay) console.log(`- Player has ${hp} hit points, ${mp} mana`);
    if (replay) console.log(`- Boss has ${boss_hp} hit points`);
    def = 0;
    if (shield_turns > 0) {
      def = 7;
      shield_turns -= 1;
      if (replay) console.log(`Shield is active; timer is now ${shield_turns}`);
    }
    if (poison_turns > 0) {
      boss_hp -= 3;
      poison_turns -= 1;
      if (replay) console.log(`Poison deals 3 damage; timer is now ${poison_turns}`);
    }
    if (recharge_turns > 0) {
      mp += 101;
      recharge_turns -= 1;
      if (replay) console.log(`Recharge provides 101 mp; timer is now ${recharge_turns}`);
    }
    if (boss_hp > 0) {
      const dmg = Math.max(1, BOSS_ATK - def);
      hp -= dmg;
      if (replay) console.log(`Boss attacks for ${BOSS_ATK} - ${def} = ${dmg} damage`);
    }
  }
  if (boss_hp <= 0) {
    // we beat the boss!
    if (replay) console.log(`WINNER`);
    return true;
  } else if (hp <= 0) {
    // we died
    if (replay) console.log(`YOU DIED`);
    return false;
  } else if (mp < 53 && recharge_turns === 0) {
    // if we end our turn with less than 53 mana
    // and no recharge then we have lost
    if (replay) console.log('OOM');
    return false;
  } else {
    // return new state
    return [hp, mp, boss_hp, shield_turns, poison_turns, recharge_turns];
  }
}

function stringPath(path) {
  return path.map((n) => {
    return ['Magic Missile', 'Drain', 'Shield', 'Poison', 'Recharge'][n];
  }).join(',');
}

function replay(state, path) {
  for (let i = 0; i < path.length; i++) {
    state = castSpell(state, path[i], true);
  }
}

const initial_state = [START_HP, START_MP, START_BOSS_HP, 0, 0, 0];
const initial_key = createKey(initial_state);
const states = { [initial_key]: initial_state };
const costs = { [initial_key]: 0 };
const paths = { [initial_key]: [] };

let finished = false;
const q = [initial_key];
while (q.length && !finished) {
  q.sort((a, b) => {
    return costs[a] < costs[b] ? -1 : 1;
  });
  const prev_key = q.shift();
  const prev_state = states[prev_key];
  const prev_cost = costs[prev_key];
  const prev_path = paths[prev_key];
  // console.log({ prev_state, prev_cost, prev_path });
  for (let i = 0; i < 5; i++) {
    const new_state = castSpell(prev_state, i);
    const new_cost = prev_cost + [53, 73, 113, 173, 229][i];
    const new_path = [...prev_path, i];
    if (new_state === true) {
      // we beat the boss!
      // LCS means this is the least cost path
      console.log(`WINNAR`, new_cost);
      console.log(stringPath(new_path));
      if (debug) replay(initial_state, new_path);
      finished = true;
      break;
    } else if (new_state === false) {
      // we died - do nothing
    } else {
      const new_key = createKey(new_state);
      if (!states[new_key]) {
        states[new_key] = new_state;
        costs[new_key] = new_cost;
        paths[new_key] = new_path;
        q.push(new_key);
      } else if (costs[new_key] < new_cost) {
        // console.log('BEEN HERE BEFORE!!!', { old: costs[new_key], new: new_cost });
      } else if (costs[new_key] > new_cost) {
        console.log('FOUND BETTER PATH!!!', {
          key: new_key,
          old: costs[new_key],
          new: new_cost,
          old_path: stringPath(paths[new_key]),
          new_path: stringPath(new_path),
        });
      }
    }
  }
}

console.log(`${hrTime() - start}µs`);