import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../lib/kanji-alive-categorized.json');

function report() {
    console.log(`Reading ${DATA_FILE}...`);
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(content);

    const radicals = Object.keys(data);
    let totalKanji = 0;

    // Sort by kanji count just for info
    const sorted = radicals.map(r => {
        const count = data[r].kanji.length;
        totalKanji += count;
        return { name: r, count: count };
    }).sort((a, b) => b.count - a.count);

    console.log(`Total Radicals (Categories): ${radicals.length}`);
    console.log(`Total Kanji: ${totalKanji}`);

    console.log("\nTop 5 Radicals by Kanji count:");
    sorted.slice(0, 5).forEach(r => console.log(`- ${r.name}: ${r.count}`));
}

report();
