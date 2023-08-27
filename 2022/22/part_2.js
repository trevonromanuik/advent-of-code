const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const lines = input.split('\r\n');
const moves = lines.pop();
lines.pop();
let num_tiles = 0;
let max_line_length = 0;
lines.forEach((line) => {
  if(line.length > max_line_length) max_line_length = line.length;
  num_tiles += line.trim().length;
});
const edge_size = Math.sqrt(num_tiles / 6);
const num_cols = max_line_length / edge_size;
const num_rows = lines.length / edge_size;
const map_layout = test ? [
  [,,0,],
  [1,2,3,],
  [,,4,5],
] : [
  [,0,1],
  [,2,],
  [3,4,],
  [5,,],
];
const face_mappings = test ? [
  // ..0.
  // 123.
  // ..45
  {
    i: 0,
    ox: 2,
    oy: 0,
    '^': [1, 'v'],
    'v': [3, 'v'],
    '<': [2, 'v'],
    '>': [5, '<'],
  },
  {
    i: 1,
    ox: 0,
    oy: 1,
    '^': [0, 'v'],
    'v': [4, '^'],
    '<': [5, '^'],
    '>': [2, '>'],
  },
  {
    i: 2,
    ox: 1,
    oy: 1,
    '^': [0, '>'],
    'v': [4, '>'],
    '<': [1, '<'],
    '>': [3, '>'],
  },
  {
    i: 3,
    ox: 2,
    oy: 1,
    '^': [0, '^'],
    'v': [4, 'v'],
    '<': [2, '<'],
    '>': [5, 'v'],
  },
  {
    i: 4,
    ox: 2,
    oy: 2,
    '^': [3, '^'],
    'v': [1, '^'],
    '<': [2, '^'],
    '>': [5, '>'],
  },
  {
    i: 5,
    ox: 3,
    oy: 2,
    '^': [3, '<'],
    'v': [1, '>'],
    '<': [4, '<'],
    '>': [0, '<'],
  },
] : [
  // .01
  // .2.
  // 34.
  // 5..
  {
    i: 0,
    ox: 1,
    oy: 0,
    '^': [5, '>'],
    'v': [2, 'v'],
    '<': [3, '>'],
    '>': [1, '>'],
  },
  {
    i: 1,
    ox: 2,
    oy: 0,
    '^': [5, '^'],
    'v': [2, '<'],
    '<': [0, '<'],
    '>': [4, '<'],
  },
  {
    i: 2,
    ox: 1,
    oy: 1,
    '^': [0, '^'],
    'v': [4, 'v'],
    '<': [3, 'v'],
    '>': [1, '^'],
  },
  {
    i: 3,
    ox: 0,
    oy: 2,
    '^': [2, '>'],
    'v': [5, 'v'],
    '<': [0, '>'],
    '>': [4, '>'],
  },
  {
    i: 4,
    ox: 1,
    oy: 2,
    '^': [2, '^'],
    'v': [5, '<'],
    '<': [3, '<'],
    '>': [1, '<'],
  },
  {
    i: 5,
    ox: 0,
    oy: 3,
    '^': [3, '^'],
    'v': [1, 'v'],
    '<': [0, 'v'],
    '>': [4, '^'],
  },
];

const faces = face_mappings.map((mapping) => {
  const map = new Array(edge_size);
  for(let i = 0; i < edge_size; i++) {
    map[i] = lines[mapping.oy * edge_size + i]
      .substring(mapping.ox * edge_size, (mapping.ox + 1) * edge_size)
      .split('');
  }
  return {
    ...mapping,
    map
  };
});

let dir = '>';
let f = 0;
let y = 0;
let x = faces[f].map[y].findIndex((v) => {
  return v === '.';
});

function drawMap() {
  for(let i = 0; i < num_rows; i++) {
    for(let j = 0; j < edge_size; j++) {
      let line = '';
      for(let k = 0; k < num_cols; k++) {
        const fi = map_layout[i][k];
        if(isNaN(fi)) {
          for(let l = 0; l < edge_size; l++) {
            line += ' ';
          }
        } else {
          line += faces[fi].map[j].join('');
        }
      }
      console.log(line);
    }
  }
  console.log();
}

if(debug) drawMap();

let branches = {};
['a', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'o', 'p'].forEach((k) => {
  branches[k] = true;
});

for(let i = 0; i < moves.length; i++) {
  switch(moves[i]) {
    case 'L':
      if(debug) console.log('turning left');
      dir = {
        '^': '<',
        'v': '>',
        '<': 'v',
        '>': '^',
      }[dir];
      break;
    case 'R':
      if(debug) console.log('turning right');
      dir = {
        '^': '>',
        'v': '<',
        '<': '^',
        '>': 'v',
      }[dir];
      break;
    default:
      let j;
      for(j = i; j < moves.length; j++) {
        if(moves[j] === 'L' || moves[j] === 'R') break;
      }
      const n = parseInt(moves.substring(i, j));
      if(debug) console.log(`moving ${dir} ${n}`);
      i = j - 1;
      for(j = 0; j < n; j++) {
        const [dx, dy] = {
          '^': [0, -1],
          'v': [0, 1],
          '<': [-1, 0],
          '>': [1, 0],
        }[dir];
        let nx = x + dx;
        let ny = y + dy;        
        let nf = f;
        let ndir = dir;
        if(ny < 0 || ny >= edge_size || nx < 0 || nx >= edge_size) {
          nf = faces[f][dir][0];
          ndir = faces[f][dir][1];
          let b;
          ({
            '^': () => {
              ({
                '^': () => {
                  nx = x;
                  ny = edge_size - 1;
                  b = 'a';
                },
                'v': () => {
                  nx = edge_size - x - 1;
                  ny = 0;
                  b = 'b';
                },
                '<': () => {
                  nx = edge_size - 1;
                  ny = edge_size - x - 1;
                  b = 'c';
                },
                '>': () => {
                  nx = 0;
                  ny = x;
                  b = 'd';
                },
              }[ndir])();
            },
            'v': () => {
              ({
                '^': () => {
                  nx = edge_size - x - 1;
                  ny = edge_size - 1;
                  b = 'e';
                },
                'v': () => {
                  nx = x;
                  ny = 0;
                  b = 'f';
                },
                '<': () => {
                  nx = edge_size - 1;
                  ny = x;
                  b = 'g';
                },
                '>': () => {
                  nx = 0;
                  ny = edge_size - x - 1;
                  b = 'h';
                },
              }[ndir])();
            },
            '<': () => {
              ({
                '^': () => {
                  nx = edge_size - y - 1;
                  ny = edge_size - 1;
                  b = 'i';
                },
                'v': () => {
                  nx = y;
                  ny = 0;
                  b = 'j';
                },
                '<': () => {
                  nx = edge_size - 1;
                  ny = y;
                  b = 'k';
                },
                '>': () => {
                  nx = 0;
                  ny = edge_size - y - 1;
                  b = 'l';
                },
              }[ndir])();
            },
            '>': () => {
              ({
                '^': () => {
                  nx = y;
                  ny = edge_size - 1;
                  b = 'm';
                },
                'v': () => {
                  nx = y + 1;
                  ny = 0;
                  b = 'n';
                },
                '<': () => {
                  nx = edge_size - 1;
                  ny = edge_size - y - 1;
                  b = 'o';
                },
                '>': () => {
                  nx = 0;
                  ny = y;
                  b = 'p';
                },
              }[ndir])();
            },
          }[dir])();
          if(debug) console.log(b);
          branches[b] = true;
        }
        faces[f].map[y][x] = dir;
        if(faces[nf].map[ny][nx] === '#') {
          break;
        }
        faces[nf].map[ny][nx] = dir;
        x = nx;
        y = ny;
        f = nf;
        dir = ndir;
      }
      if(debug) drawMap();
  }
}

if(!debug) drawMap();

const dir_score = {
  '^': 3,
  'v': 1,
  '<': 2,
  '>': 0,
}[dir];
const code = ((y + (edge_size * faces[f].oy) + 1) * 1000) + ((x + (edge_size * faces[f].ox) + 1) * 4) + dir_score;
console.log(code);
if(debug) console.log(Object.keys(branches).sort());