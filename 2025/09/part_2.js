const fs = require('fs');
const path = require('path');

const test = false;
const debug = true;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

function summary(start) {
  const time = `${hrTime() - start}µs`;
  const usage = memoryUsage();
  usage['time'] = time;
  return usage;
}

function memoryUsage() {
  const usage = process.memoryUsage();
  Object.keys(usage).forEach((key) => {
    usage[key] = `${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`
  });
  return usage;
}

function hrTime() {
  const t = process.hrtime();
  return Math.floor(t[0] * 1000000 + t[1] / 1000);
}

const start = hrTime();

const coords = input.replaceAll('\r', '').split('\n').map((line) => {
  return line.split(',').map(n => parseInt(n));
});

const point_in_polygon_cache = {};
function pointInPolygon([x, y]) {
  const k = `${x},${y}`;
  if (!point_in_polygon_cache.hasOwnProperty(k)) {
    let inside = false;
    for (let i = 0; i < coords.length; i++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[(i + 1) % coords.length];

      // horizontal edge - ignore it
      if (y1 === y2) continue;

      // vertical line to the left of x - ignore it
      if (x1 < x) continue;

      // vertical line to the right of x - check if raycast intersects
      const [min_y, max_y] = [y1, y2].sort((a, b) => a < b ? -1 : 1);
      if (min_y < y && max_y > y) inside = !inside;

    }
    point_in_polygon_cache[k] = inside;
  }
  return point_in_polygon_cache[k];
}

function rectInPolygon([x1, y1], [x2, y2]) {
  let [r_min_x, r_max_x] = [x1, x2].sort((a, b) => a < b ? -1 : 1);
  let [r_min_y, r_max_y] = [y1, y2].sort((a, b) => a < b ? -1 : 1);

  r_min_x += 0.5;
  r_max_x -= 0.5;
  r_min_y += 0.5;
  r_max_y -= 0.5;

  const corners = [[r_min_x, r_min_y], [r_min_x, r_max_y], [r_max_x, r_min_y], [r_max_x, r_max_y]];
  for (let i = 0; i < corners.length; i++) {
    if (!pointInPolygon(corners[i])) return false;
  }

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];
    if (x1 === x2) {
      // vertical line
      const [e_min_y, e_max_y] = [y1, y2].sort((a, b) => a < b ? -1 : 1);
      // check the top edge
      if (r_min_x < x1 && r_max_x > x1 && r_min_y > e_min_y && r_min_y < e_max_y) return false;
      // check the bottom edge
      if (r_min_x < x1 && r_max_x > x1 && r_max_y > e_min_y && r_max_y < e_max_y) return false;
    } else {
      // horizontal line
      const [e_min_x, e_max_x] = [x1, x2].sort((a, b) => a < b ? -1 : 1);
      // check the left edge
      if (r_min_y < y1 && r_max_y > y1 && r_min_x > e_min_x && r_min_x < e_max_x) return false;
      // check the right edge
      if (r_min_y < y1 && r_max_y > y1 && r_max_x > e_min_x && r_max_x < e_max_x) return false;
    }
  }

  return true;
}

let max_area = -Infinity;
for (let i = 0; i < coords.length; i++) {
  const [x1, y1] = coords[i];
  for (let j = i + 1; j < coords.length; j++) {
    const [x2, y2] = coords[j];
    // assume that the solution will have the length of both sides > 1
    if (x1 === x2 || y1 === y2) continue;
    const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
    if (area > max_area) {
      if (rectInPolygon(coords[i], coords[j])) {
        max_area = area;
      }
    }
  }
}

console.log({ max_area });

console.log(JSON.stringify(summary(start)));