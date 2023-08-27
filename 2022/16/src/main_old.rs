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
    // valves = dbg!(valves);
    let mut distances: HashMap<String, HashMap<String, u32>> = HashMap::new();
    for key in valves.keys() {
        let mut my_distances: HashMap<String, u32> = HashMap::from([(key.to_string(), 0)]);
        let mut queue: Vec<String> = vec!(key.to_string());
        loop {
            if queue.is_empty() { break; }
            // queue.sort_by(|a, b| my_distances.get(a).unwrap().cmp(my_distances.get(b).unwrap()));
            let k = queue.pop().unwrap();
            let d = my_distances.get(&k).copied().unwrap();
            // println!("visiting {}: {}", k, d);
            for e in &valves.get(&k).unwrap().edges {
                match my_distances.get(e) {
                    Some(n) if d + 1 >= *n => {
                        ()
                    },
                    _ => {
                        // println!("pushing {}: {}", e, d + 1);
                        my_distances.insert(e.to_string(), d + 1);
                        queue.push(e.to_string());
                    }
                }
            }
        }
        distances.insert(key.to_string(), my_distances);
    }
    // distances = dbg!(distances);
    let mut minutes = 30;
    let mut total = 0;
    let mut pos = "AA".to_string();
    let mut closed_valves: Vec<String> = valves.keys().cloned().collect();
    while minutes > 0 {
        let mut potentials: HashMap<String, u32> = closed_valves.iter().map(|v| {
            let d: u32 = distances[&pos][v];
            let mut potential: u32 = 0;
            if (d + 1) <= minutes {
                potential = (minutes - (d + 1)) * valves[v].rate;
            }
            (v.to_string(), potential)
        }).collect();
        potentials = dbg!(potentials);
        closed_valves.sort_by(|a, b| {
            potentials[a].cmp(&potentials[b])
        });
        let v = closed_valves.pop().unwrap();
        println!("{} - {} + 1", minutes, distances[&pos][&v]);
        let d = distances[&pos][&v];
        minutes -= d;
        if minutes > 0 { minutes -= 1; }
        let p = potentials[&v];
        total += p;
        println!(
            "moving to {}, with {} potential, will take {} minutes, plus 1 to open, bringing total to {}",
            v, p, d, total
        );
        pos = v;
    }
    println!("part 1: {}", total);
}

struct Valve {
    rate: u32,
    edges: Vec<String>,
}
