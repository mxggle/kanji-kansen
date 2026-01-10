
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KANJI_DB_PATH = path.join(__dirname, '../lib/kanji-db.json');
const SVG_DIR = path.join(__dirname, '../public/kanjivg/kanji');

// Radicals already included
const INCLUDED_RADICALS = new Set([
    "水", "氵", "氺", "木", "火", "灬", "土", "日", "月",
    "人", "亻", "女", "子", "口", "心", "忄", "⺗", "手", "扌",
    "言", "行", "走", "目", "耳", "足",
    "車", "門", "金", "糸", "貝", "刀", "刂"
]);

function getHexCode(char) {
    let code = char.charCodeAt(0).toString(16);
    return "00000".substring(0, 5 - code.length) + code;
}

function getRadicalFromSvg(char) {
    const hex = getHexCode(char);
    const svgPath = path.join(SVG_DIR, `${hex}.svg`);

    if (!fs.existsSync(svgPath)) return null;

    const content = fs.readFileSync(svgPath, 'utf8');
    const radicalMatch = content.match(/<g[^>]*kvg:element="([^"]+)"[^>]*kvg:radical="[^"]+"[^>]*>/);

    if (radicalMatch && radicalMatch[1]) {
        return radicalMatch[1];
    }
    return null;
}

function main() {
    const kanjiDb = JSON.parse(fs.readFileSync(KANJI_DB_PATH, 'utf8'));
    const excludedRadicalCounts = {};
    let totalExcluded = 0;

    for (const kanji of kanjiDb) {
        const radical = getRadicalFromSvg(kanji.char);

        if (radical) {
            if (!INCLUDED_RADICALS.has(radical)) {
                excludedRadicalCounts[radical] = (excludedRadicalCounts[radical] || 0) + 1;
                totalExcluded++;
            }
        } else {
            // console.log(`No radical found for ${kanji.char}`);
        }
    }

    console.log(`Total excluded kanji: ${totalExcluded}`);
    console.log("Top 20 excluded radicals:");

    Object.entries(excludedRadicalCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .forEach(([radical, count]) => {
            console.log(`${radical}: ${count}`);
        });
}

main();
