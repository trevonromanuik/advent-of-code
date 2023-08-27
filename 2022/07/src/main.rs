use std::fs;
use std::collections::HashMap;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input file");   
    
    let mut stack: Vec<String> = Vec::from(["/".to_string()]);
    let mut sizes: HashMap<String, u32> = HashMap::from([("/".to_string(), 0)]);
    for line in input.lines() {
        let split: Vec<&str> = line.split(" ").collect();
        match split[0] {
            "$" => {
                match split[1] {
                    "cd" => {
                        match split[2] {
                            "/" => {
                                stack = Vec::from(["/".to_string()]);
                            },
                            ".." => {
                                stack.pop();
                            },
                            _ => {
                                let mut dir = stack[stack.len() - 1].to_string();
                                dir.push_str("/");
                                dir.push_str(split[2]);
                                stack.push(dir.to_string());
                            }
                        };
                    },
                    _ => ()
                }
            },
            "dir" => {
                let mut dir = stack[stack.len() - 1].to_string();
                dir.push_str("/");
                dir.push_str(split[1]);
                if !sizes.contains_key(dir.as_str()) {
                    sizes.insert(dir, 0);
                }
            },
            _ => {
                let size: u32 = split[0].parse().unwrap();
                for dir in &stack {
                    sizes.insert(dir.to_string(), sizes.get(dir).unwrap() + size);
                }
            }
        }
    }

    let total_disk: u32 = 70000000;
    let unused_disk: u32 = total_disk - sizes.get("/").unwrap();
    let disk_to_free: u32 = 30000000 - unused_disk;

    let mut sum: u32 = 0;
    let mut best_size: u32 = u32::MAX;
    for (_dir, size) in sizes.iter() {
        if *size <= 100000 { sum += *size; }
        if *size > disk_to_free && *size < best_size { best_size = *size; }
    }
    println!("part 1: {}", sum);
    println!("part 2: {}", best_size);

}