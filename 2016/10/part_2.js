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

const TARGET_LOW = test ? 2 : 17;
const TARGET_HIGH = test ? 5 : 61;

const bots = {};
input.replaceAll('\r', '').split('\n').forEach((line) => {
  const s = line.split(' ');
  const bot_id = s[0] === 'value' ? s[5] : s[1];
  if (!bots[bot_id]) bots[bot_id] = { chips: [], outs: null };
  if (s[0] === 'value') {
    bots[bot_id].chips.push(parseInt(s[1]));
  } else {
    bots[bot_id].outs = [
      [s[5], s[6]],
      [s[10], s[11]],
    ];
  }
});

const bot_ids = Object.keys(bots);

const outputs = {};
while (
  outputs['0'] == null
  || outputs['1'] == null
  || outputs['2'] == null
) {
  for (let i = 0; i < bot_ids.length; i++) {
    const bot = bots[bot_ids[i]];
    if (bot.chips.length < 2) continue;
    const [low, high] = bot.chips.sort((a, b) => a < b ? -1 : 1);
    if (test) console.log(`bot ${bot_ids[i]} gives ${low} to ${bot.outs[0][0]} ${bot.outs[0][1]}`);
    if (bot.outs[0][0] === "bot") {
      bots[bot.outs[0][1]].chips.push(low);
    } else {
      outputs[bot.outs[0][1]] = low;
    }
    if (test) console.log(`bot ${bot_ids[i]} gives ${high} to ${bot.outs[1][0]} ${bot.outs[1][1]}`);
    if (bot.outs[1][0] === "bot") {
      bots[bot.outs[1][1]].chips.push(high);
    } else {
      outputs[bot.outs[1][1]] = high;
    }
    bot.chips = [];
  }
}

const product = outputs['0'] * outputs['1'] * outputs['2'];
console.log({ product });

console.log(`${hrTime() - start}µs`);