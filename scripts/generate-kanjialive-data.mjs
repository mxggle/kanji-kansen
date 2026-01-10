import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, '../kanji_alive_media/language-data/ka_data.csv');
const OUTPUT_FILE = path.join(__dirname, '../lib/kanji-alive-categorized.json');

function parseCSVLine(line) {
    const fields = [];
    let currentField = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (inQuote) {
            if (char === '"') {
                if (nextChar === '"') {
                    currentField += '"';
                    i++; // Skip next quote
                } else {
                    inQuote = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuote = true;
            } else if (char === ',') {
                fields.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    fields.push(currentField);
    return fields;
}

function normalizeExamples(exampleString) {
    if (!exampleString) return [];
    try {
        // examples are like "[ [ ""xx"", ""yy"" ], ... ]"
        // We can try to clean it up to be valid JSON or just parse manually if it's messy.
        // The CSV parser inside parseCSVLine handles the outer double quotes.
        // So exampleString here is: [ [ "一年生（いちねんせい）", "first-year student" ], ... ]
        // This looks like valid JSON if we replace single quotes if any? 
        // Actually it seems to be valid JSON format `[[ "str", "str"], ...]`
        return JSON.parse(exampleString);
    } catch (e) {
        // console.warn("Failed to parse examples:", exampleString);
        return [];
    }
}

function main() {
    console.log(`Reading CSV from ${CSV_PATH}...`);
    const content = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = content.split(/\r?\n/);

    // Header: kanji,kname,kstroke,kmeaning,kgrade,kunyomi_ja,kunyomi,onyomi_ja,onyomi,examples,radical,rad_order,rad_stroke,rad_name_ja,rad_name,rad_meaning,rad_position_ja,rad_position
    const headers = parseCSVLine(lines[0]);
    // Map headers to indices
    const h = {};
    headers.forEach((key, index) => h[key] = index);

    const categorized = {};
    const keyMap = {}; // Map "radicalName_radicalChar" -> uniqueKey
    let count = 0;

    // Skip header and empty lines
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const cols = parseCSVLine(lines[i]);
        if (cols.length < headers.length) continue;

        const char = cols[h['kanji']];
        const radicalName = cols[h['rad_name']]; // e.g. "water"
        const radicalChar = cols[h['radical']]; // e.g. "氵"
        const radicalMeaning = cols[h['rad_meaning']];

        if (!char || !radicalName) continue;

        const uniqueId = `${radicalName}_${radicalChar}`;
        let key = keyMap[uniqueId];

        if (!key) {
            // Determine new key
            if (!categorized[radicalName]) {
                key = radicalName;
            } else {
                // Collision!
                const suffix = radicalMeaning ? radicalMeaning.split(',')[0].trim().replace(/\s+/g, '_').toLowerCase() : 'alt';
                key = `${radicalName}_${suffix}`;

                // If even THAT exists (rare), just append char code
                if (categorized[key]) {
                    key = `${radicalName}_${radicalChar}`;
                }
            }
            keyMap[uniqueId] = key;

            // Initialize if new
            if (!categorized[key]) {
                categorized[key] = {
                    radical_char: radicalChar,
                    kanji: []
                };
            }
        }

        categorized[key].kanji.push({
            char: char,
            stroke: parseInt(cols[h['kstroke']]) || 0,
            meaning: cols[h['kmeaning']],
            grade: parseInt(cols[h['kgrade']]) || null,
            onyomi: cols[h['onyomi_ja']],
            kunyomi: cols[h['kunyomi_ja']],
            examples: normalizeExamples(cols[h['examples']])
        });

        count++;
    }

    console.log(`Processed ${count} kanji.`);
    console.log(`Found ${Object.keys(categorized).length} radical categories.`);

    // Sort categories alphabetically
    const sortedCategorized = {};
    Object.keys(categorized).sort().forEach(key => {
        sortedCategorized[key] = categorized[key];
    });

    console.log(`Writing to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedCategorized, null, 2));
    console.log("Done.");
}

main();
