use std::fs;
use std::collections::HashSet;
use std::time::Instant;

fn main() {
    // part1("test_input.txt", 10);
    // part2("test_input.txt", 20);
    part1("input.txt", 2000000);
    part2("input.txt", 4000000);
}

fn part1(path: &str, row: i32) {
    let input = fs::read_to_string(path).expect("error reading input file");
    let sensors: Vec<_> = parse_sensors(&input);
    let mut no_beacons: HashSet<i32> = HashSet::new();
    let mut beacons: HashSet<i32> = HashSet::new();
    for (sx, sy, bx, by, d) in sensors {
        let dy = (row - sy).abs();
        let dx = d - dy;
        if dx >= 0 {
            for i in -dx..(dx + 1) {
                no_beacons.insert(sx + i);
            }
        }
        if by == row {
            beacons.insert(bx);
        }
    }
    let diff = no_beacons.difference(&beacons);
    let mut xs: Vec<_> = diff.collect();
    xs.sort();
    println!("part 1: {}", no_beacons.len() - beacons.len());
}

fn part2(path: &str, rows: i32) {
    let now = Instant::now();
    let input = fs::read_to_string(path).expect("error reading input file");
    let sensors = parse_sensors(&input);
    for ny in 0..(rows + 1) {
        println!("{}", ny);
        let mut ranges: Vec<(i32, i32)> = Vec::new();
        for (sx, sy, _, _, d) in &sensors {
            let dy = (ny - sy).abs();
            let dx = d - dy;
            if dx >= 0 {
                ranges.push((sx - dx, sx + dx));
            }
        }
        ranges.sort_by(|a, b| {
            let r = a.0.cmp(&b.0);
            if r == std::cmp::Ordering::Equal {
                a.1.cmp(&b.1)
            } else { 
                r 
            }
        });
        let mut r = ranges[0];
        for i in 1..ranges.len() {
            let (x1, x2) = r;
            let (x3, x4) = ranges[i];
            if x3 > (x2 + 1) {
                println!("found it: {},{}", x2 + 1, ny);
                println!("part 2: {}", (((x2 + 1) as usize) * 4000000) + (ny as usize));
                println!("{}", now.elapsed().as_millis());
                return;
            } else if x2 < x4 {
                r = (x1, x4);
            } else {
                r = (x1, x2);
            }
        }
    }
}

fn parse_sensors(input: &str) -> Vec<(i32, i32, i32, i32, i32)> {
    input.lines().map(|line| {
        let (l, r) = line.split_once(": ").unwrap();
        let (sx, sy) = l.split_once(", ").unwrap();
        let sx: i32 = sx[12..].parse().unwrap();
        let sy: i32 = sy[2..].parse().unwrap();
        let (bx, by) = r.split_once(", ").unwrap();
        let bx: i32 = bx[23..].parse().unwrap();
        let by: i32 = by[2..].parse().unwrap();
        (sx, sy, bx, by, (bx - sx).abs() + (by - sy).abs())
    }).collect()
}