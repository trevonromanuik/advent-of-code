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

const p = corners.reduce((p, tile) => {
    return p * tile.id;
}, 1);
console.log({ p });

console.log(`${hrTime() - start}µs`);