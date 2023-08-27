use std::collections::HashMap;
use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input.txt");
    part1(&input);
    part2(&input);
}

fn part1(input: &str) {
    let scores: HashMap<&str, u32> = HashMap::from([("X", 1), ("Y", 2), ("Z", 3)]);

    let mapping: HashMap<&str, &str> = HashMap::from([("X", "A"), ("Y", "B"), ("Z", "C")]);

    let beats: HashMap<&str, &str> = HashMap::from([("X", "C"), ("Y", "A"), ("Z", "B")]);

    let sum: u32 = input
        .lines()
        .map(|line| {
            let s: Vec<&str> = line.split(" ").collect();
            let mut score = scores[s[1]];
            if s[0] == mapping[s[1]] {
                score += 3;
            } else if s[0] == beats[s[1]] {
                score += 6;
            }
            // println!("{} {}: {}", s[0], s[1], score);
            score
        })
        .sum();

    println!("part 1: {}", sum);
}

fn part2(input: &str) {
    let scores: HashMap<&str, u32> = HashMap::from([("R", 1), ("P", 2), ("S", 3)]);

    let matchups: HashMap<&str, (&str, &str, &str)> = HashMap::from([
        ("A", ("S", "R", "P")),
        ("B", ("R", "P", "S")),
        ("C", ("P", "S", "R")),
    ]);

    let sum: u32 = input
        .lines()
        .map(|line| {
            let s: Vec<&str> = line.split(" ").collect();
            let (m, mut score) = match s[1] {
                "X" => (matchups[s[0]].0, 0),
                "Y" => (matchups[s[0]].1, 3),
                "Z" => (matchups[s[0]].2, 6),
                _ => panic!(),
            };
            score += scores[m];
            // println!("{} {}: {}", s[0], s[1], score);
            score
        })
        .sum();

    println!("part 2: {}", sum);
}
