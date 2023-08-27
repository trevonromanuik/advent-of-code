const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const lines = input.split('\r\n');
const num_rows = lines.length - 2;
const num_cols = lines[0].length - 2;
const modulo = num_rows * num_cols;
if(debug) console.log({ modulo });

const rows = new Array(num_rows);
for(let i = 0; i < num_rows; i++) rows[i] = [];

const cols = new Array(num_cols);
for(let i = 0; i < num_cols; i++) cols[i] = [];

for(let i = 1; i <= num_rows; i++) {
  for(let j = 1; j <= num_cols; j++) {
    switch(lines[i][j]) {
      case '^':
      case 'v':
        cols[j - 1].push([lines[i][j], i - 1]);
        break;
      case '<':
      case '>':
        rows[i - 1].push([lines[i][j], j - 1]);
        break;
    }
  }
}

// console.log(JSON.stringify({ rows }));
// console.log(JSON.stringify({ cols }));

function drawMap({ x, y, s }) {
  const map = new Array(num_rows + 2);
  for(let i = 0; i < map.length; i++) {
    if(i === 0) {
      const row = new Array(num_cols + 2).fill('#');
      row[1] = '.';
      map[i] = row;
    } else if(i === map.length - 1) {
      const row = new Array(num_cols + 2).fill('#');
      row[num_cols] = '.';
      map[i] = row;
    } else {
      const row = new Array(num_cols + 2).fill('.');
      row[0] = '#';
      row[num_cols + 1] = '#';
      map[i] = row;
    }
  }
  map[y + 1][x + 1] = 'E';
  rows.forEach((row, y) => {
    row.forEach(([dir, x]) => {
      // console.log('row', x, y, dir, s, modulo, num_cols);
      x = dir === '<' ?
        (x - (s % modulo)) % num_cols :
        (x + (s % modulo)) % num_cols;
      if(x < 0) x += num_cols;
      const v = map[y + 1][x + 1];
      // console.log('\trow', x, y, v);
      if(v === '.') {
        map[y + 1][x + 1] = dir;
      } else if(['^', 'v', '<', '>'].includes(v)) {
        map[y + 1][x + 1] = 2;
      } else {
        map[y + 1][x + 1]++;
      }
    });
  });
  cols.forEach((col, x) => { 
    col.forEach(([dir, y]) => {
      // console.log('col', x, y, dir, s, modulo, num_rows);
      y = dir === '^' ?
        (y - (s % modulo)) % num_rows :
        (y + (s % modulo)) % num_rows;
      if(y < 0) y += num_rows;
      const v = map[y + 1][x + 1];
      // console.log('\tcol', x, y, v);
      if(v === '.') {
        map[y + 1][x + 1] = dir;
      } else if(['^', 'v', '<', '>'].includes(v)) {
        map[y + 1][x + 1] = 2;
      } else {
        map[y + 1][x + 1]++;
      }
    });
  });
  map.forEach((row) => {
    console.log(row.join(''));
  });
}

function createKey({ x, y, s }) {
  return `${x}/${y}/${s % modulo}`;
}

function calcScore({ x, y, s }) {
  return x + y - s;
}

const start_node = { x: 0, y: -1, s: 0, p: null };
const start_key = createKey(start_node);
const nodes = { [start_key]: start_node };
const start_score = calcScore(start_node);
const scores = { [start_key]: start_score };
const q = [start_key];
// const steps = 12;
// let step = 0;
while(q.length) {
  // if(++step > steps) break;
  q.sort((a, b) => {
    return scores[a] < scores[b] ? -1 : 1;
  });
  const k = q.pop();
  const { x, y, s } = nodes[k];
  console.log();
  console.log(nodes[k], q.length);
  if(debug) drawMap({ x, y, s });

  if(x === num_cols - 1 && y === num_rows - 1) {
    // win condition
    if(debug) {
      const path = [{ 
        x: num_cols - 1, 
        y: num_rows, 
        s: s + 1,
        p: k,
      }, nodes[k]];
      let p = nodes[k].p;
      while(p) {
        path.push(nodes[p]);
        p = nodes[p].p;
      }
      path.reverse();
      path.forEach((node, i) => {
        console.log(`Step ${i}`);
        drawMap(node);
        console.log();
      });
    }
    console.log(`found it! ${s + 1}`);
    break;
  }

  const moves = [
    [false, true, false],
    [y >= 0, true, y >= 0],
    [false, true, false],
  ];

  const debug2 = false;
  for(let i = -1; i <= 1; i++) {
    // check row
    const iy = i + y;
    if(debug2) console.log('check row', iy);
    if(iy < 0) {
      if(debug2) console.log(`${iy} < 0 -> moves[0][1] = false`);
      moves[0][1] = false;
    } else if(iy >= num_rows) {
      if(debug2) console.log(`${iy} >= ${num_rows} -> moves[2][1] = false`);
      moves[2][1] = false;
    } else {
      for(let j = 0; j < rows[iy].length; j++) {
        const [dir, rx] = rows[iy][j];
        let jx = dir === '<' ?
          (rx - ((s + 1) % modulo)) % num_cols :
          (rx + ((s + 1) % modulo)) % num_cols;
        if(jx < 0) jx += num_cols;
        if(debug2) console.log(`${dir} at ${rx},${iy} will be at ${jx},${iy} on step ${s + 1}`);
        const dx = x - jx;
        const dy = y - iy;
        if(Math.abs(dx) + Math.abs(dy) <= 1) {
          if(debug2) console.log(`Math.abs(${dx}) + Math.abs(${dy}) <= 1 -> moves[${1 - dy}][${1 - dx}] = false`);
          moves[1 - dy][1 - dx] = false;
        }
      }
    }
    
    // check col
    const ix = i + x;
    if(debug2) console.log('check col', ix);
    if(ix < 0) {
      if(debug2) console.log(`${ix} < 0 -> moves[1][0] = false`);
      moves[1][0] = false;
    } else if(ix >= num_cols) {
      if(debug2) console.log(`${ix} >= ${num_cols} -> moves[1][2] = false`);
      moves[1][2] = false;
    } else {
      for(let j = 0; j < cols[ix].length; j++) {
        const [dir, ry] = cols[ix][j];
        let jy = dir === '^' ?
          (ry - ((s + 1) % modulo)) % num_rows :
          (ry + ((s + 1) % modulo)) % num_rows;
        if(jy < 0) jy += num_rows;
        if(debug2) console.log(`${dir} at ${ix},${ry} will be at ${ix},${jy} on step ${s + 1}`);
        const dx = x - ix;
        const dy = y - jy;
        if(Math.abs(dx) + Math.abs(dy) <= 1) {
          if(debug2) console.log(`Math.abs(${dx}) + Math.abs(${dy}) <= 1 -> moves[${1 - dy}][${1 - dx}] = false`);
          moves[1 - dy][1 - dx] = false;
        }
      }
    }
  }

  if(debug2) console.log(JSON.stringify(moves));

  // do moves
  for(let i = 0; i < moves.length; i++) {
    for(let j = 0; j < moves[i].length; j++) {
      if(moves[i][j]) {
        const new_node = { 
          x: x + j - 1,
          y: y + i - 1,
          s: s + 1,
          p: k,
        };
        const new_key = createKey(new_node);
        if(!nodes[new_key]) {
          nodes[new_key] = new_node;
          const new_score = calcScore(new_node);
          scores[new_key] = new_score;
          q.push(new_key);
          if(debug) console.log(`new_node`, new_node);
        }
      }
    }
  }
}