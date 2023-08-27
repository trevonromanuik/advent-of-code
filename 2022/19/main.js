const fs = require('fs');
const path = require('path');
const { start } = require('repl');

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const keys = ['o', 'c', 'b', 'g'];

const blueprints = input.split('\n').map((line) => {
  const split = line.split(' ');
  const b = {
    n: parseInt(split[1].substring(0, split[1].length - 1)),
    o: { o: parseInt(split[6]) },
    c: { o: parseInt(split[12]) },
    b: { o: parseInt(split[18]), c: parseInt(split[21]) },
    g: { o: parseInt(split[27]), b: parseInt(split[30]) },
  };
  b.max_costs = keys.reduce((acc, k) => {
    acc[k] = Math.max(...keys.map((bk) => {
      return b[bk][k] || 0;
    })) || Infinity;
    return acc;
  }, {});
  return b;
});

function createKey(n) {
  return keys.map((k) => {
    return `${n.bots[k] || 0}:${n.rocks[k] || 0}`;
  }).join('/');
}

const MAX_MINS = 32;
const max_geodes = [];
for(let i = 0; i < MAX_MINS; i++) {
  if(i === 0) max_geodes.push(0);
  else max_geodes.push(max_geodes[i - 1] + i);
}

const product = [
  blueprints[0],
  blueprints[1],
  blueprints[2],
].reduce((product, b) => {
  const start_node = {
    bots: { o: 1 },
    rocks: {},
    mins: 0,
    prev: null,
  };
  const start_key = createKey(start_node);
  const seen_nodes = { [start_key]: start_node };
  const queue = [start_key];
  let best_key = null;
  let best_node = null;
  while(queue.length) {
    const nk = queue.pop();
    const n = seen_nodes[nk];
    const debug = false;
    // const debug = (nk === '2:3/5:10/0:0/0:0') || n.debug;
    // console.log(nk, n.mins);
    const remaining = MAX_MINS - n.mins;
    let new_nodes = false;
    keys.forEach((rk) => {
      // short out if we already have enough of this robit
      if((n.bots[rk] || 0) >= b.max_costs[rk]) {
        if(debug) console.log(`\t\tshortout ${rk} (enough robits ${n.bots[rk]} ${b.max_costs[rk]})`);
        return;
      }
      // short out if we have less than 2 mins remaining
      if(remaining < 2) {
        if(debug) console.log(`\t\tshortout ${rk} (${remaining} minutes remaining)`);
        return;
      }
      if(best_node) {
        // short out if it is impossible to do better than the existing best_node
        // in the best case scenario
        if((n.rocks.g || 0) + ((n.bots.g || 0) * remaining) + max_geodes[remaining] < (best_node.rocks.g || 0)) {
          if(debug) console.log(`\t\tshortout ${rk} (impossible score)`);
          return;
        }
      }
      // calculate how long to wait to build this robit
      const cost = b[rk];
      const wait = Math.max(...keys.map((k) => {
        const rn = n.rocks[k] || 0;
        const bn = n.bots[k] || 0;
        const cn = cost[k] || 0;
        if(rn >= cn) return 0;
        if(bn === 0) return Infinity;
        return Math.ceil((cn - rn) / bn);
      })) + 1;
      if(wait === Infinity) return;
      if(n.mins + wait > MAX_MINS) return;
      // wait and build the robit      
      const new_node = {
        bots: keys.reduce((acc, k) => {
          let x = (n.bots[k] || 0);
          if(k === rk) x++;
          if(x > 0) acc[k] = x;
          return acc;
        }, {}),
        rocks: keys.reduce((acc, k) => {
          let x = (n.rocks[k] || 0);
          x += (n.bots[k] || 0) * wait;
          x -= (cost[k] || 0);
          if(x > 0) acc[k] = x;
          return acc;
        }, {}),
        mins: n.mins + wait,
        prev: nk,
        build: rk,
        debug: debug,
      };
      const new_key = createKey(new_node);
      if(!seen_nodes[new_key] || seen_nodes[new_key].mins > new_node.mins) {
        if(debug) console.log(`\tpushing new key: ${new_key} ${new_node.mins}`);
        if(debug) if(seen_nodes[new_key]) console.log(`\t\treplacing seen node ${seen_nodes[new_key].mins}`);
        seen_nodes[new_key] = new_node;
        queue.push(new_key);
        new_nodes = true;
      }
    });
    if(!new_nodes) {
      // we can't build any more robits - 
      // wait and see how many geodes we can get
      // (and if it's more than best_node)
      const wait = MAX_MINS - n.mins;
      const end_node = {
        bots: keys.reduce((acc, k) => {
          let x = (n.bots[k] || 0);
          if(x > 0) acc[k] = x;
          return acc;
        }, {}),
        rocks: keys.reduce((acc, k) => {
          let x = (n.rocks[k] || 0);
          x += (n.bots[k] || 0) * wait;
          if(x > 0) acc[k] = x;
          return acc;
        }, {}),
        mins: n.mins + wait,
        prev: wait === 0 ? n.prev : nk,
      };
      const end_key = createKey(end_node);
      seen_nodes[end_key] = end_node;
      // console.log(`\ttesting new end_node: ${end_key} ${best_key}`);
      if(!best_node || (end_node.rocks.g || 0) > (best_node.rocks.g || 0)) {
        // console.log(`\t\tnew best_node: ${end_key}`);
        best_key = end_key;
        best_node = end_node;
      }
    }
  }
  // console.log('\n\n');
  // let cur_key = best_key;
  // const path = [];
  // while(cur_key) {
  //   console.log(cur_key, seen_nodes[cur_key].mins);
  //   path.unshift(cur_key);
  //   cur_key = seen_nodes[cur_key].prev;
  // }
  // let path_index = 0;
  // for(let i = 1; i <= MAX_MINS; i++) {
  //   console.log(`== Minute ${i} ==`);
  //   if(path[path_index + 1] && i >= seen_nodes[path[path_index + 1]].mins) {
  //     path_index++;
  //   }
  //   console.log(path[path_index]);
  //   const n = seen_nodes[path[path_index]];
  //   if(i === n.mins) {
  //     if(n.build) {
  //       console.log(`Build ${n.build}`);
  //     }
  //   }
  //   keys.forEach((k) => {
  //     if(n.bots[k]) {
  //       console.log(`${n.bots[k]} x ${k}: ${(n.rocks[k] || 0) + (n.bots[k] * (i - n.mins))}`);
  //     }
  //   });
  //   if(i === n.mins) {
  //     if(n.build) {
  //       console.log(`${n.build} ready: ${(n.bots[n.build] || 0)}`);
  //     }
  //   }
  //   console.log('\n');
  // }
  const best_g = (seen_nodes[best_key].rocks.g || 0);
  console.log(product, b.n, best_g);
  product *= best_g;
  return product;
}, 1);
console.log(product);