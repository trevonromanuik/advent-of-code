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

class Tile {
    constructor(chunk) {
        const lines = chunk.split('\n');
        this.id = parseInt(lines.shift().substring(5));
        this.grid = lines.map((line) => line.split(''));
        this.h = this.grid.length;
        this.w = this.grid[0].length;
    }

    flip() {
        this.grid.forEach((row) => {
            row.reverse();
        });
    }

    rotate() {
        const new_grid = new Array(this.h);
        for(let i = 0; i < this.h; i++) {
            const new_row = new Array(this.w);
            for(let j = 0; j < this.w; j++) {
                new_row[j] = this.grid[this.h - 1 - j][i];
            }
            new_grid[i] = new_row;
        }
        this.grid = new_grid;
    }

    draw() {
        console.log(this.grid.map((row) => row.join('')).join('\n'));
    }

    edges() {
        return [
            // top
            this.grid[0].join(''),
            // right
            [...new Array(this.h).keys()].map((i) => {
                return this.grid[i][this.w - 1];
            }).join(''),
            // botton
            this.grid[this.h - 1].join(''),
            // left
            [...new Array(this.h).keys()].map((i) => {
                return this.grid[i][0];
            }).join(''),
        ];
    }
}

const tiles = input.replaceAll('\r', '').split('\n\n').map((chunk) => {
    return new Tile(chunk);
});

const edges_to_tiles = tiles.reduce((edges_to_tiles, tile) => {
    tile.edges().forEach((edge) => {
        if (!edges_to_tiles[edge]) edges_to_tiles[edge] = [tile];
        else edges_to_tiles[edge].push(tile);
        edge = edge.split('').reverse().join('');
        if (!edges_to_tiles[edge]) edges_to_tiles[edge] = [tile];
        else edges_to_tiles[edge].push(tile);
    });
    return edges_to_tiles;
}, {});

const corners = [];
tiles.forEach((tile) => {
    const unique_edges = tile.edges().filter((edge) => {
        return edges_to_tiles[edge].length === 1;
    });
    if (unique_edges.length === 2) {
        corners.push(tile);
    }
});

let tile_size = tiles[0].h;
const map_size = Math.sqrt(tiles.length);
const map = new Array(map_size);
[...map.keys()].forEach((i) => {
    map[i] = new Array(map_size).fill(null);
});

function doesFit(tile, x, y) {
    const edges = tile.edges();
    if (y === 0) {
        // top edge
        if (edges_to_tiles[edges[0]].length !== 1) return false;
    } else {
        const top_tile = map[y - 1][x];
        if (edges[0] !== top_tile.edges()[2]) return false;
    }
    if (x === 0) {
        // left edge
        if (edges_to_tiles[edges[3]].length !== 1) return false;
    } else {
        const left_tile = map[y][x - 1];
        if (edges[3] !== left_tile.edges()[1]) return false;
    }
    return true;
}

for(let y = 0; y < map_size; y++) {
    for (let x = 0; x < map_size; x++) {
        let next_tile = null;
        if (x === 0) {
            if (y === 0) {
                // top left corner
                next_tile = corners[0];
                next_tile.flip();
            } else {
                // left edge
                top_tile = map[y - 1][x];
                bottom_edge = top_tile.edges()[2];
                next_tile = edges_to_tiles[bottom_edge].find((tile) => {
                    return tile.id !== top_tile.id;
                });
            }
        } else {
            left_tile = map[y][x - 1];
            right_edge = left_tile.edges()[1];
            next_tile = edges_to_tiles[right_edge].find((tile) => {
                return tile.id !== left_tile.id;
            });
        }

        for (let i = 0; i < 8; i++) {
            if (i === 4) next_tile.flip();
            if (doesFit(next_tile, x, y)) {
                map[y][x] = next_tile;
                break;
            } else {
                next_tile.rotate();
            }
        }

        if (!map[y][x]) {
            throw new Error(`could not place tile ${next_tile.id} at ${x},${y}`);
        }
    }
}

console.log(map.map((row) => {
    return row.map((tile) => {
        return tile.id;
    }).join('\t');
}).join('\n'));

map.forEach((row) => {
    row.forEach((tile) => {
        tile.grid.shift();
        tile.grid.pop();
        tile.grid.forEach((row) => {
            row.shift();
            row.pop();
        });
        tile.h -= 2;
        tile.w -= 2;
    });
});

tile_size -= 2;

const map_string = [...new Array(map_size * tile_size).keys()].map((i) => {
    const y2 = i % tile_size;
    const y = Math.floor(i / tile_size);
    return map[y].map((tile) => {
        return tile.grid[y2].join('');
    }).join('');
}).join('\n');

const tile = new Tile(`Tile X:\n${map_string}`);

//                  # 
//#    ##    ##    ###
// #  #  #  #  #  #   

const sea_monster = [
    [18],
    [0, 5, 6, 11, 12, 17, 18, 19],
    [1, 4, 7, 10, 13, 16],
];

for(let i = 0; i < 8; i++) {
    if (i === 4) tile.flip();
    for (let y = 0; y < tile.h - 3; y++) {
        for (let x = 0; x < tile.w - 20; x++) {
            let mismatch = false;
            for (let j = 0; j < sea_monster.length; j++) {
                for (let k = 0; k < sea_monster[j].length; k++) {
                    const c = tile.grid[y + j][x + sea_monster[j][k]];
                    if (c !== '#' && c !== 'O') {
                        mismatch = true;
                        break;
                    }
                }
                if (mismatch) break;
            }
            if (!mismatch) {
                for (let j = 0; j < sea_monster.length; j++) {
                    for (let k = 0; k < sea_monster[j].length; k++) {
                        tile.grid[y + j][x + sea_monster[j][k]] = 'O';
                    }
                }
            }
        }
    }
    tile.rotate();
}

const count = tile.grid.reduce((count, row) => {
    return count + row.filter((c) => {
        return c === '#';
    }).length;
}, 0);

console.log({ count });
console.log(`${hrTime() - start}µs`);