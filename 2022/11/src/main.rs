use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input file");
    println!("part 1: {}", solve(&input, 20, 3));
    println!("part 2: {}", solve(&input, 10000, 1));
}

fn solve(input: &str, rounds: usize, worry_factor: usize) -> usize {
    let mut monkeys: Vec<Monkey> = input.split("\n\n").map(|chunk| {
        let lines: Vec<&str> = chunk.lines().collect();
        Monkey {
            inspections: 0,
            items: lines[1][18..].split(", ").map(|n| n.parse().unwrap()).collect(),
            op: lines[2][23..24].to_string(),
            op_n: lines[2][25..].parse().map_or(None, |n| Some(n)),
            div: lines[3][21..].parse().unwrap(),
            pass: lines[4][29..].parse().unwrap(),
            fail: lines[5][30..].parse().unwrap(),
        }
    }).collect();

    let div_product: usize = monkeys.iter().map(|monkey| monkey.div).product();
    
    for _ in 0..rounds {
        for i in 0..monkeys.len() {
            while let Some(item) = monkeys[i].items.pop() {
                monkeys[i].inspections += 1;
                let n = match monkeys[i].op_n {
                    Some(n) => n,
                    None => item,
                };
                let mut item = match monkeys[i].op.as_str() {
                    "*" => item * n,
                    "+" => item + n,
                    _ => item,
                };
                item = item / worry_factor;
                let target = match item % monkeys[i].div == 0 {
                    true => monkeys[i].pass,
                    false => monkeys[i].fail,
                };
                monkeys[target].items.push(item % div_product);
            }
        }
    }

    monkeys.sort_by_key(|m| std::cmp::Reverse(m.inspections));
    monkeys[0..2].iter().map(|m| m.inspections).product()
}

#[derive(Debug)]
struct Monkey {
    inspections: usize,
    items: Vec<usize>,
    op: String,
    op_n: Option<usize>,
    div: usize,
    pass: usize,
    fail: usize,
}