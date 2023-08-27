use std::collections::HashMap;
use std::collections::VecDeque;
use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input file");
    let mut start: Option<(isize, isize)> = None;
    let mut end: Option<(isize, isize)> = None;
    let map: Vec<Vec<isize>> = input
        .lines()
        .enumerate()
        .map(|(i, line)| {
            line.chars()
                .enumerate()
                .map(|(j, char)| match char {
                    'S' => {
                        start = Some(((i as isize), (j as isize)));
                        1
                    }
                    'E' => {
                        end = Some(((i as isize), (j as isize)));
                        26
                    }
                    c => (c as isize) - 96,
                })
                .collect()
        })
        .collect();
    let start: (isize, isize) = start.unwrap();
    let end: (isize, isize) = end.unwrap();
    let h = map.len() as isize;
    let w = map[0].len() as isize;

    {
        let mut queue: VecDeque<(isize, isize)> = VecDeque::new();
        queue.push_back(start);
        let mut steps: HashMap<(isize, isize), usize> = HashMap::from([(start, 0)]);
        loop {
            queue
                .make_contiguous()
                .sort_by(|a, b| steps.get(a).unwrap().cmp(steps.get(b).unwrap()));
            let (i, j) = queue.pop_front().unwrap();
            let n_steps = steps.get(&(i, j)).copied().unwrap();
            // println!("visiting {},{}: {}", j, i, n_steps);
            if (i, j) == end {
                // println!("found the end!");
                println!("part 1: {}", steps.get(&end).unwrap());
                break;
            }
            for (x, y) in [(i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)] {
                if x < 0 {
                    continue;
                }
                if x >= h {
                    continue;
                }
                if y < 0 {
                    continue;
                }
                if y >= w {
                    continue;
                }
                if (map[x as usize][y as usize]) - (map[i as usize][j as usize]) < 2 {
                    match steps.get(&(x, y)) {
                        Some(n) if n_steps + 1 >= *n => {
                            // println!("skipping {},{} because {} >= {}", y, x, n_steps + 1, n);
                        }
                        _ => {
                            // println!("pushing {},{}: {}", y, x, n_steps + 1);
                            steps.insert((x, y), n_steps + 1);
                            queue.push_back((x, y));
                        }
                    };
                }
            }
        }
    }

    {
        let mut queue: VecDeque<(isize, isize)> = VecDeque::new();
        queue.push_back(end);
        let mut steps: HashMap<(isize, isize), usize> = HashMap::from([(end, 0)]);
        loop {
            queue
                .make_contiguous()
                .sort_by(|a, b| steps.get(a).unwrap().cmp(steps.get(b).unwrap()));
            let (i, j) = queue.pop_front().unwrap();
            let n_steps = steps.get(&(i, j)).copied().unwrap();
            // println!("visiting {},{}: {}", j, i, n_steps);
            if map[i as usize][j as usize] == 1 {
                // println!("found the end!");
                println!("part 2: {}", steps.get(&(i, j)).unwrap());
                break;
            }
            for (x, y) in [(i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)] {
                if x < 0 {
                    continue;
                }
                if x >= h {
                    continue;
                }
                if y < 0 {
                    continue;
                }
                if y >= w {
                    continue;
                }
                if (map[i as usize][j as usize]) - (map[x as usize][y as usize]) < 2 {
                    match steps.get(&(x, y)) {
                        Some(n) if n_steps + 1 >= *n => {
                            // println!("skipping {},{} because {} >= {}", y, x, n_steps + 1, n);
                        }
                        _ => {
                            // println!("pushing {},{}: {}", y, x, n_steps + 1);
                            steps.insert((x, y), n_steps + 1);
                            queue.push_back((x, y));
                        }
                    };
                }
            }
        }
    }
}
