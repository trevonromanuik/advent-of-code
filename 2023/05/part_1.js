const fs = require('fs');
const path = require('path');

const test = false;
const debug = false;
const input_file = test ? './test_input.txt' : './input.txt';
const input = fs.readFileSync(path.resolve(__dirname, input_file), 'utf-8');

const start = Date.now();

let seeds;
let seed_to_soil = [];
let soil_to_fertilizer = [];
let fertilizer_to_water = [];
let water_to_light = [];
let light_to_temperature = [];
let temperature_to_humidity = [];
let humidity_to_location = [];
let current_map = null;
input.split('\n').forEach((line) => {
    if (!line) return;
    if (line.startsWith('seeds:')) {
        seeds = line.substring(7).split(' ').map((n) => {
            return parseInt(n);
        });
    } else if (line.startsWith('seed-to-soil')) {
        current_map = seed_to_soil;
    } else if (line.startsWith('soil-to-fertilizer')) {
        current_map = soil_to_fertilizer;
    } else if (line.startsWith('fertilizer-to-water')) {
        current_map = fertilizer_to_water;
    } else if (line.startsWith('water-to-light')) {
        current_map = water_to_light;
    } else if (line.startsWith('light-to-temperature')) {
        current_map = light_to_temperature;
    } else if (line.startsWith('temperature-to-humidity')) {
        current_map = temperature_to_humidity;
    } else if (line.startsWith('humidity-to-location')) {
        current_map = humidity_to_location;
    } else {
        current_map.push(line.split(' ').map((n) => {
            return parseInt(n);
        }));
    }
});

[
    seed_to_soil,
    soil_to_fertilizer,
    fertilizer_to_water,
    water_to_light,
    light_to_temperature,
    temperature_to_humidity,
    humidity_to_location
].forEach((map) => {
    map.sort((a, b) => {
        return a < b ? -1 : 1;
    });
});

if (debug) {
    console.log(JSON.stringify({
        seeds,
        seed_to_soil,
        soil_to_fertilizer,
        fertilizer_to_water,
        water_to_light,
        light_to_temperature,
        temperature_to_humidity,
        humidity_to_location,
    }));
}

const r = [
    seed_to_soil,
    soil_to_fertilizer,
    fertilizer_to_water,
    water_to_light,
    light_to_temperature,
    temperature_to_humidity,
    humidity_to_location
].reduce((values, mappings) => {
    const r = values.map((v) => {
        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];
            const d = v - mapping[1];
            if (d >= 0 && d < mapping[2]) {
                return mapping[0] + d;
            }
        }
        return v;
    });
    if (debug) console.log(`${values} -> ${r}`);
    return r;
}, seeds);
console.log(Math.min(...r), `${Date.now() - start}ms`);