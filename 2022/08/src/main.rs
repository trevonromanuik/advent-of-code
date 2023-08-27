use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input.txt");
    let mut grid = parse_grid(&input);
    let h = grid.len();
    let w = grid[0].len();
    for i in 0..h {
        let mut max: usize = 0;
        for j in 0..w {
            // l -> r
            let (new_max, visible) = check_node(grid[i][j], max, j, w);
            if visible { 
                // println!("{},{} ({}) visible from left - {}/{}", i, j, grid[i][j].0, max, new_max);
                grid[i][j].1 = true;
            } else {
                // println!("{},{} ({}) NOT visible from left - {}/{}", i, j, grid[i][j].0, max, new_max);
            }
            max = new_max
        }
        max = 0;
        for j in (0..w).rev() {
            // r -> l
            let (new_max, visible) = check_node(grid[i][j], max, j, w);
            if visible {
                // println!("{},{} ({}) visible from right - {}/{}", i, j, grid[i][j].0, max, new_max);
                grid[i][j].1 = true;
            } else {
                // println!("{},{} ({}) NOT visible from right - {}/{}", i, j, grid[i][j].0, max, new_max);
            }
            max = new_max
        }
    }
    for j in 0..w {
        let mut max: usize = 0;
        for i in 0..h {
            // u -> d
            let (new_max, visible) = check_node(grid[i][j], max, i, h);
            if visible { 
                // println!("{},{} ({}) visible from top - {}/{}", i, j, grid[i][j].0, max, new_max);
                grid[i][j].1 = true;
            } else {
                // println!("{},{} ({}) NOT visible from top - {}/{}", i, j, grid[i][j].0, max, new_max);
            }
            max = new_max
        }
        max = 0;
        for i in (0..h).rev() {
            // u -> d
            let (new_max, visible) = check_node(grid[i][j], max, i, h);
            if visible { 
                // println!("{},{} ({}) visible from bottom - {}/{}", i, j, grid[i][j].0, max, new_max);
                grid[i][j].1 = true;
            } else {
                // println!("{},{} ({}) NOT visible from bottom - {}/{}", i, j, grid[i][j].0, max, new_max);
            }
            max = new_max
        }
    }

    let sum: u32 = grid.iter().map(|row| {
        row.iter().map(|(_, visible)| {
            if *visible { 1 } else { 0 }
        }).sum::<u32>()
    }).sum::<u32>();

    println!("part 1: {}", sum);

    let mut best_score: u32 = 0;
    for i in 0..h {
        for j in 0..w {
            let n = grid[i][j].0;

            let mut score: u32 = 1;
            let mut count = 0;

            // look up
            for i2 in (0..i).rev() {
                count += 1;
                if grid[i2][j].0 >= n { break; }
            }
            // println!("{} up", count);
            score *= count;
            count = 0;
            
            // look down
            for i2 in (i + 1)..h {
                count += 1;
                if grid[i2][j].0 >= n { break; }
            }
            // println!("{} down", count);
            score *= count;
            count = 0;

            // look left
            for j2 in (0..j).rev() {
                count += 1;
                if grid[i][j2].0 >= n { break; }
            }
            // println!("{} left", count);
            score *= count;
            count = 0;

            // look right
            for j2 in (j + 1)..w {
                count += 1;
                if grid[i][j2].0 >= n { break; }
            }
            // println!("{} right", count);
            score *= count;
            count = 0;

            if score > best_score { 
                best_score = score; 
            }
        }
    }

    println!("part 2: {}", best_score);
}

fn parse_grid(input: &str) -> Vec<Vec<(usize, bool)>> {
    input.lines().map(|line| {
        line.chars().map(|c| {
            let n: u32 = c.to_digit(10).unwrap();
            (usize::try_from(n).unwrap(), false)
        }).collect()
    }).collect()
}

fn check_node(n: (usize, bool), max: usize, i: usize, len: usize) -> (usize, bool) {
    let mut new_max = max;
    let mut visible = false;
    if i == 0 || i == len - 1 {
        visible = true;
    }
    if n.0 > max {
        visible = true;
        new_max = n.0;
    }
    (new_max, visible)
}