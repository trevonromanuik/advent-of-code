use std::fs;
use std::collections::HashSet;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input file");
    println!("part 1: {}", solve(&input, 2));
    println!("part 2: {}", solve(&input, 10));
}

fn solve(input: &str, num_knots: u32) -> usize {
    let mut knots = vec![(0,0); num_knots as usize];
    let mut visited: HashSet<(i32, i32)> = HashSet::from([(0, 0)]);
    for line in input.lines() {
        let (dir, n) = line.split_once(" ").unwrap();
        let n: u32 = n.parse().unwrap();
        // println!("== {} {} ==", dir, n);
        for _ in 0..n {
            match dir {
                "R" => knots[0].0 += 1,
                "L" => knots[0].0 -= 1,
                "U" => knots[0].1 -= 1,
                "D" => knots[0].1 += 1,
                _ => (),
            }
            for i in 1..knots.len() {
                knots[i] = follow(&knots[i - 1], &knots[i]);
            }
            visited.insert(knots[knots.len() - 1]);
            // print(&knots);
        }
        // print(&knots);
    }
    visited.len()
}

fn follow(head: &(i32, i32), tail: &(i32, i32)) -> (i32, i32) {
    let dx = head.0 - tail.0;
    let dy = head.1 - tail.1;
    if dx.abs() > 1 || dy.abs() > 1 {
       (tail.0 + dx.signum(), tail.1 + dy.signum()) 
    } else {
        (tail.0, tail.1)
    }
}

fn print(knots: &Vec<(i32, i32)>) {
    for i in -15..16 {
        for j in -15..16 {
            let mut found = false;
            for k in 0..knots.len() {
                if knots[k].0 == j && knots[k].1 == i {
                    if k == 0 {
                        print!("H");
                    } else if k == knots.len() - 1 {
                        print!("T");
                    } else {
                        print!("{}", k);
                    }
                    found = true;
                    break;
                }
            }
            if !found { 
                if i == 0 && j == 0 {
                    print!("s");
                } else {
                    print!("."); 
                }
            }
        }
        print!("\n");
    }
    print!("\n");
}