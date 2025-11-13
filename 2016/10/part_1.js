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

let bot_id = null;
while (bot_id === null) {
  for (let i = 0; i < bot_ids.length; i++) {
    const bot = bots[bot_ids[i]];
    if (bot.chips.length < 2) continue;
    const [low, high] = bot.chips.sort((a, b) => a < b ? -1 : 1);
    if (low === TARGET_LOW && high === TARGET_HIGH) {
      bot_id = bot_ids[i];
      break;
    }
    if (bot.outs[0][0] === "bot") {
      if (test) console.log(`bot ${bot_ids[i]} gives ${low} to bot ${bot.outs[0][1]}`);
      bots[bot.outs[0][1]].chips.push(low);
    }
    if (bot.outs[1][0] === "bot") {
      if (test) console.log(`bot ${bot_ids[i]} gives ${high} to bot ${bot.outs[1][1]}`);
      bots[bot.outs[1][1]].chips.push(high);
    }
    bot.chips = [];
  }
}

console.log({ bot_id });

console.log(`${hrTime() - start}µs`);