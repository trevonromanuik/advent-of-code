use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input file");
    // part1(&input);
    part2(&input);
}

fn part1(input: &str) {
    let mut sum = 0;
    for (i, pair) in input.split("\n\n").enumerate() {
        let (left, right) = pair.split_once("\n").unwrap();
        let left = parse_line(left);
        let right = parse_line(right);
        println!("== Pair {} ==", i + 1);
        match compare(&left, &right, "".to_string()) {
            Some(b) => {
                // println!("{},{}", i + 1, b);
                if b { sum += i + 1; }
            }
            _ => ()
        }
    }
    println!("part 1: {}", sum);
}

fn part2(input: &str) {
    let mut packets: Vec<Item> = Vec::new();
    packets.push(parse_line("[[2]]"));
    packets.push(parse_line("[[6]]"));
    let mut lines = input.lines();
    while let Some(line) = lines.next() {
        if line.is_empty() { continue; }
        packets.push(parse_line(line));
    }
    packets.sort_by(|a, b| {
        match compare(a, b, "".to_string()) {
            Some(true) => std::cmp::Ordering::Less,
            None => std::cmp::Ordering::Equal,
            Some(false) => std::cmp::Ordering::Greater,
        }
    });
    let mut product = 1;
    for (i, packet) in packets.iter().enumerate() {
        // println!("{}", print(&packet));
        match print(&packet).as_str() {
            "[[2,],]" | "[[6,],]" => product *= i + 1,
            _ => (),
        }
    }
    println!("part 2: {}", product);
}

#[derive(Debug)]
enum Item {
    Integer(u32),
    Vector(Vec<Item>),
}

fn parse_line(line: &str) -> Item {
    let mut vecs: Vec<Vec<Item>> = Vec::from([Vec::new()]);
    let mut chars = line.chars().peekable();
    while let Some(c) = chars.next() {
        match c {
            '[' => {
                vecs.push(Vec::new());
            }
            ']' => {
                let vec = vecs.pop().unwrap();
                vecs.last_mut().unwrap().push(Item::Vector(vec));
            }
            ',' => (),
            _ => {
                let mut n_str = c.to_string();
                loop {
                    match chars.peek() {
                        None | Some(']') | Some(',') => {
                            vecs.last_mut()
                                .unwrap()
                                .push(Item::Integer(n_str.parse().unwrap()));
                            break;
                        },
                        Some(c) => {
                            n_str += &c.to_string();
                            chars.next();
                        }
                    }
                }
                
            }
        }
    }
    vecs.pop().unwrap().pop().unwrap()
}

fn compare(left: &Item, right: &Item, indent: String) -> Option<bool> {
    // println!("{}- Compare {} vs {}", indent, print(left), print(right));
    match left {
        Item::Integer(ln) => {
            match right {
                Item::Integer(rn) => {
                    match ((*ln as i32) - (*rn as i32)).signum() {
                        -1 => {
                            // println!("  {}- Left side is smaller, return true", indent);
                            return Some(true);
                        },
                        1 => {
                            // println!("  {}- Right side is smaller, return false", indent);
                            return Some(false);
                        },
                        _ => {
                            // println!("  {}- Side are equal, continue", indent);
                            return None;
                        },
                    }
                },
                Item::Vector(_) => {
                    let new_left = &Item::Vector(Vec::from([Item::Integer(*ln)]));
                    // println!(" {}- Mixed types; convert left to {} and try again", indent, print(new_left));
                    return compare(new_left, right, indent + " ");
                }
            }
        },
        Item::Vector(lv) => {
            match right {
                Item::Integer(rn) => {
                    let new_right = &Item::Vector(Vec::from([Item::Integer(*rn)]));
                    // println!(" {}- Mixed types; convert right to {} and try again", indent, print(new_right));
                    return compare(left, new_right, indent + " ");
                },
                Item::Vector(rv) => {
                    let len = if lv.len() > rv.len() { lv.len() } else { rv.len() };
                    let new_indent = indent + " ";
                    for i in 0..len {
                        let l = lv.get(i);
                        if l.is_none() {
                            // println!("{}- Left side ran out of items, return true", new_indent);
                            return Some(true);
                        }
                        let r = rv.get(i);
                        if r.is_none() {
                            // println!("{}- Right side ran out of items, return false", new_indent);
                            return Some(false);
                        }
                        let r = compare(&lv[i], &rv[i], new_indent.to_string());
                        if r.is_some() { return r; }
                    }
                    return None;
                }
            }
        },
    }
}

fn print(item: &Item) -> String {
    let mut s = String::new();
    match item {
        Item::Integer(n) => {
            s.push_str(&n.to_string());
        }
        Item::Vector(v) => {
            s.push_str("[");
            for item in v {
                s.push_str(&print(item));
                s.push_str(",");
            }
            s.push_str("]");
        }
    }
    s
}