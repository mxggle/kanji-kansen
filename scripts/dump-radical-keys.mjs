import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../lib/kanji-alive-categorized.json');

const content = fs.readFileSync(DATA_FILE, 'utf8');
const data = JSON.parse(content);

console.log("Existing Keys and Radicals:");
Object.keys(data).sort().forEach(key => {
    // Print in format: key (char)
    console.log(`${key} (${data[key].radical_char})`);
});
