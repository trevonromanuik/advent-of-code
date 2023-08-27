use std::collections::HashSet;
use std::fs;

const UPPER_OFFSET: u32 = 65 - 27;
const LOWER_OFFSET: u32 = 97 - 1;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input.txt");
    part1(&input);
    part2(&input);
}

fn part1(input: &str) {
    let sum: u32 = input.lines().map(|line| {
        let len = line.len();
        let head = to_set(&line[..len/2]);
        let tail = to_set(&line[len/2..]);
        head.intersection(&tail).map(|c| {
            to_score(*c)
        }).sum::<u32>()
    }).sum();

    println!("part 1: {}", sum);
}

fn part2(input: &str) {
    let mut lines = input.lines();
    let mut sum = 0;
    loop {

        let line1 = lines.next();
        let line2 = lines.next();
        let line3 = lines.next();
        if line1.is_none() { break; }

        let pack1 = to_set(&line1.unwrap());
        let pack2 = to_set(&line2.unwrap());
        let pack3 = to_set(&line3.unwrap());

        let intersection = pack1.intersection(&pack2);
        let mut intersection_set: HashSet<char> = HashSet::new();
        for c in intersection {
            intersection_set.insert(*c);
        }

        sum += intersection_set.intersection(&pack3).map(|c| {
            to_score(*c)
        }).sum::<u32>()

    }

    println!("part 2: {}", sum);
}

fn to_set(pack: &str) -> HashSet<char> {
    let mut set: HashSet<char> = HashSet::new();
    for c in pack.chars() { set.insert(c); }
    set
}

fn to_score(c: char) -> u32 {
    if c.is_uppercase() {
        c as u32 - UPPER_OFFSET
    } else {
        c as u32 - LOWER_OFFSET
    }
}