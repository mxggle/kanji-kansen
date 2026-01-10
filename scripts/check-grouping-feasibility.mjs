import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../lib/kanji-alive-categorized.json');

const TARGET_GROUPS = {
    "Nature": ["水", "氵", "木", "火", "灬", "土", "日", "月"],
    "Human": ["人", "亻", "女", "子", "口", "心", "忄", "手", "扌"],
    "Action/State": ["言", "訁", "行", "走", "目", "耳", "足"],
    "Objects": ["車", "門", "金", "糸", "貝", "刀", "刂"]
};

function checkCategories() {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(content);

    // Create a map of radical_char -> key
    const charToKey = {};
    Object.entries(data).forEach(([key, value]) => {
        charToKey[value.radical_char] = key;
    });

    console.log("Mapping Analysis:");

    for (const [category, radicals] of Object.entries(TARGET_GROUPS)) {
        console.log(`\nCategory: ${category}`);
        radicals.forEach(rad => {
            if (charToKey[rad]) {
                console.log(`  [FOUND] ${rad} -> ${charToKey[rad]}`);
            } else {
                console.log(`  [MISSING] ${rad}`);
                // Try searching for partial matches or alt forms manually if needed
            }
        });
    }
}

checkCategories();
