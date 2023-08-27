use std::fs;
use std::collections::HashSet;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input.txt");
    part1(&input);
    part2(&input);
}

fn part1(input: &str) {
    println!("part 2: {}", solve(input, 4));
}

fn part2(input: &str) {
    println!("part 2: {}", solve(input, 14));
}

fn solve(input: &str, n: usize) -> usize {
    let c: Vec<char> = input.chars().collect();
    let mut index: usize = 0;
    for i in n..c.len() {
        let set: HashSet<&char> = HashSet::from_iter(&c[(i - n)..i]);
        if set.len() == n { 
            index = i;
            break;
        }
    }
    index
}

