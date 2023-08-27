use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input.txt");
    part1(&input);
    part2(&input);
}

fn part1(input: &str) {
    let (stacks_str, moves_str) = input.split_once("\n\n").unwrap();
    let mut stacks = parse_stacks(stacks_str);

    moves_str.lines().for_each(|line| {
        let (n, from, to) = parse_line(line);
        for _ in 0..n {
            let c = stacks[from - 1].pop().unwrap();
            stacks[to - 1].push(c);
        }
    });

    print!("part 1: ");
    for i in 0..stacks.len() {
        print!("{}", stacks[i].pop().unwrap());
    }
    println!("");
}

fn part2(input: &str) {
    let (stacks_str, moves_str) = input.split_once("\n\n").unwrap();
    let mut stacks = parse_stacks(stacks_str);

    moves_str.lines().for_each(|line| {
        let (n, from, to) = parse_line(line);
        let mut tmp: Vec<char> = Vec::new();
        for _ in 0..n {
            tmp.push(stacks[from - 1].pop().unwrap());
        }
        for _ in 0..n {
            stacks[to - 1].push(tmp.pop().unwrap());
        }
    });

    print!("part 2: ");
    for i in 0..stacks.len() {
        print!("{}", stacks[i].pop().unwrap());
    }
    println!("");
}

fn parse_stacks(stacks_str: &str) -> Vec<Vec<char>> {
    let mut stacks: Vec<Vec<char>> = Vec::new();
    let mut stacks_lines = stacks_str.lines().rev();

    let first_line = stacks_lines.next().unwrap();
    let num_stacks: usize = first_line
        .trim()
        .chars()
        .last()
        .unwrap()
        .to_digit(10)
        .unwrap() as usize;
    for _ in 0..num_stacks {
        stacks.push(Vec::new())
    }

    stacks_lines.for_each(|line| {
        let chars: Vec<char> = line.chars().collect();
        for i in 0..num_stacks {
            let c = chars[i * 4 + 1];
            if c != ' ' {
                stacks[i].push(c)
            }
        }
    });

    stacks
}

fn parse_line(line: &str) -> (usize, usize, usize) {
    let split: Vec<&str> = line.split(' ').collect();
    let n: usize = split[1].parse().unwrap();
    let from: usize = split[3].parse().unwrap();
    let to: usize = split[5].parse().unwrap();
    (n, from, to)
}
