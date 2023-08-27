use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input file");
    let mut cycle: i32 = 0;
    let mut x: i32 = 1;
    let mut sum: i32 = 0;
    for line in input.lines() {
        cycle += 1;
        if check_cycle(cycle) { sum += x * cycle; }
        draw_pixel(cycle, x);
        match line.split_once(" ") {
            Some((_, n)) => {
                cycle += 1;
                if check_cycle(cycle) { sum += x * cycle;  }
                draw_pixel(cycle, x);
                x += n.parse::<i32>().unwrap();
            },
            None => (),
        }
    }
    println!("part 1: {}", sum);
}

fn check_cycle(cycle: i32) -> bool {
    (cycle - 20) % 40 == 0
}

fn draw_pixel(cycle: i32, x: i32) {
    if ((cycle - 1) % 40 - x).abs() > 1 { print!("."); } else { print!("#"); }
    if cycle % 40 == 0 { print!("\n"); }
}