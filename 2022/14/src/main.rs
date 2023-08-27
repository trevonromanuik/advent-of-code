use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").expect("error reading input file");
    let (min_x, max_x, max_y, lines) = input.lines().fold((usize::MAX, 0, 0, Vec::new()), |(min_x, max_x, max_y, mut lines), line| {
        let (min_x, max_x, max_y, points) = line.split(" -> ").fold((min_x, max_x, max_y, Vec::new()), |(mut min_x, mut max_x, mut max_y, mut points), pair| {
            let (x, y) = pair.split_once(",").unwrap();
            let x: usize = x.parse().unwrap();
            if x < min_x { min_x = x; };
            if x > max_x { max_x = x; }
            let y: usize = y.parse().unwrap();
            if y > max_y { max_y = y; };
            points.push((x, y));
            (min_x, max_x, max_y, points)
        });
        lines.push(points);
        (min_x, max_x, max_y, lines)
    });
    
    let min_x = 0;
    let max_x = 1000;
    let w: usize = max_x - min_x;
    let h: usize = max_y + 3;
    let min_y = 0;
    let mut map: Vec<Vec<Token>> = Vec::new();
    for _ in 0..h {
        let mut v: Vec<Token> = Vec::new();
        for _ in 0..w { v.push(Token::Air); }
        map.push(v);
    }

    for line in lines {
        for i in 1..line.len() {
            let (mut x1, y1) = line[i - 1];
            let (mut x2, y2) = line[i];
            x1 -= min_x;
            x2 -= min_x;
            if x1 == x2 {
                if y1 < y2 {
                    for j in 0..(y2 - y1 + 1) {
                        map[y1 + j][x1] = Token::Rock;
                    }
                } else {
                    for j in 0..(y1 - y2 + 1) {
                        map[y2 + j][x1] = Token::Rock;
                    }
                }
            } else {
                if x1 < x2 {
                    for j in 0..(x2 - x1 + 1) {
                        map[y1][x1 + j] = Token::Rock;
                    }
                } else {
                    for j in 0..(x1 - x2 + 1) {
                        map[y1][x2 + j] = Token::Rock;
                    }
                }
            }
        }
    }
    for i in 0..w {
        map[h - 1][i] = Token::Rock;
    }

    // print(&map);

    let mut count: u32 = 0;
    'outer: loop {
        let (mut x, mut y) = (500 - min_x, 0);
        if map[y][x] == Token::Sand { break; }
        loop {
            if y + 1 >= h { break 'outer; }
            if map[y + 1][x] == Token::Air {
                y += 1;
            } else if map[y + 1][x - 1] == Token::Air {
                y += 1;
                x -= 1;
            } else if map[y + 1][x + 1] == Token::Air {
                y += 1;
                x += 1;
            } else {
                map[y][x] = Token::Sand;
                count += 1;
                break;
            }
        }
    }

    // print(&map);
    println!("part 1: {}", count);

}

#[derive(Debug)]
#[derive(PartialEq)]
enum Token {
    Air,
    Rock,
    Sand,
}

fn print(map: &Vec<Vec<Token>>) {
    for row in map {
        for token in row {
            match token {
                Token::Air => print!("."),
                Token::Rock => print!("#"),
                Token::Sand => print!("o"),
            }
        }
        print!("\n");
    }
    print!("\n");
}