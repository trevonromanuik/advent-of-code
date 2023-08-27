use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input.txt");
    part1(&input);
    part2(&input);
}

fn part1(input: &str) {
    let sum: u32 = input.lines().map(|line| {
        let (a, b) = line.split_once(",").unwrap();
        let (a1, a2) = a.split_once("-").unwrap();
        let (b1, b2) = b.split_once("-").unwrap();
        let a1: u32 = a1.parse().unwrap();
        let a2: u32 = a2.parse().unwrap();
        let b1: u32 = b1.parse().unwrap();
        let b2: u32 = b2.parse().unwrap();
        if a1 <= b1 && a2 >= b2 { 1 }
        else if b1 <= a1 && b2 >= a2 { 1 }
        else { 0 }
    }).sum();

    println!("part 1: {}", sum);
}

fn part2(input: &str) {
    let sum: u32 = input.lines().map(|line| {
        let (a, b) = line.split_once(",").unwrap();
        let (a1, a2) = a.split_once("-").unwrap();
        let (b1, b2) = b.split_once("-").unwrap();
        let a1: u32 = a1.parse().unwrap();
        let a2: u32 = a2.parse().unwrap();
        let b1: u32 = b1.parse().unwrap();
        let b2: u32 = b2.parse().unwrap();
        if a1 <= b1 && a2 >= b1 { 1 }
        else if a1 <= b2 && a2 >= b2 { 1 }
        else if b1 <= a1 && b2 >= a1 { 1 }
        else if b1 <= a2 && b2 >= a2 { 1 }
        else { 0 }
    }).sum();

    println!("part 2: {}", sum);
}