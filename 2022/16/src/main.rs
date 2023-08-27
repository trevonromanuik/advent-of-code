use std::fs;
use std::collections::{HashMap, HashSet};

fn main() {
    let input = fs::read_to_string("test_input.txt").expect("error reading input file");
    let valves: HashMap<String, Valve> = input.lines().map(|line| {
        println!("{}", line);
        let (l, r) = match line.split_once("; tunnels lead to valves ") {
            Some((l, r)) => (l, r),
            None => line.split_once("; tunnel leads to valve ").unwrap(),
        };
        let label: String = l[6..8].to_string();
        let rate: u32 = l[23..].parse().unwrap();
        let edges: Vec<String> = r.split(", ").map(|s| { s.to_string() }).collect();
        (label, Valve { rate, edges })
    }).collect();
    let values = HashMap<(String, HashSet<String>), (u32, u32)> = HashMap::new();
    let queue: Vec<(String, HashSet<String>, u32)> = Vec::new();
    queue.push(("AA".to_string(), HashSet::new(), 0));
    while let Some((pos, open_valves, rate)) = queue.pop() {
        queue.sort_by(|a, b| {

        })
    }
}

struct Valve {
    rate: u32,
    edges: Vec<String>,
}
