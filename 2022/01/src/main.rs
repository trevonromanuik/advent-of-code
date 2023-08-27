use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input.txt");
    let mut totals: Vec<u32> = input
        .split("\n\n")
        .map(|chunk| {
            return chunk
                .lines()
                .map(|line| line.trim().parse::<u32>().expect("expected number"))
                .sum();
        })
        .collect();

    totals.sort_unstable();
    totals.reverse();

    println!("part 1: {}", totals[0]);

    let sum: u32 = totals[0..3].iter().sum();

    println!("part 2: {}", sum);
}
