import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KANJI_DB_PATH = path.join(__dirname, '../lib/kanji-db.json');
const SVG_DIR = path.join(__dirname, '../public/kanjivg/kanji');
const OUTPUT_FILE = path.join(__dirname, '../lib/kanji-categorized.json');

// Define the requested categories
const CATEGORIES = {
    "CategoryRadicals": {
        "IncludeNature": {
            "Water": ["水", "氵", "氺"],
            "Tree": ["木"],
            "Fire": ["火", "灬"],
            "Earth": ["土"],
            "Sun_Day": ["日"],
            "Moon": ["月"]
        },
        "Human": {
            "Person": ["人", "亻"],
            "Woman": ["女"],
            "Child": ["子"],
            "Mouth": ["口"],
            "Heart": ["心", "忄", "⺗"],
            "Hand": ["手", "扌"]
        },
        "Action_State": {
            "Speech": ["言"],
            "Go": ["行"],
            "Run": ["走"],
            "Eye": ["目"],
            "Ear": ["耳"],
            "Foot": ["足"]
        },
        "Objects": {
            "Vehicle": ["車"],
            "Gate": ["門"],
            "Gold_Metal": ["金"],
            "Thread": ["糸"],
            "Shell_Money": ["貝"],
            "Sword": ["刀", "刂"]
        }
    }
};

// Flatten categories for easier lookup
const RADICAL_TO_CATEGORY = {};
for (const [groupName, subGroups] of Object.entries(CATEGORIES.CategoryRadicals)) {
    for (const [subGroupName, radicals] of Object.entries(subGroups)) {
        for (const radical of radicals) {
            // Map radical char to category info
            RADICAL_TO_CATEGORY[radical] = { group: groupName, subGroup: subGroupName };
        }
    }
}

function getHexCode(char) {
    let code = char.charCodeAt(0).toString(16);
    return "00000".substring(0, 5 - code.length) + code;
}

function getRadicalFromSvg(char) {
    const hex = getHexCode(char);
    const svgPath = path.join(SVG_DIR, `${hex}.svg`);

    if (!fs.existsSync(svgPath)) {
        // console.warn(`SVG not found for ${char} (${hex})`);
        return null;
    }

    const content = fs.readFileSync(svgPath, 'utf8');

    // Regex to find the radical. 
    // It usually looks like: kvg:radical="general" or kvg:radical="tradit" on a group
    // But we need the ACTUAL radical character.
    // Looking at the file 05978.svg (好):
    // <g id="kvg:05978-g1" kvg:element="女" kvg:variant="true" kvg:position="left" kvg:radical="general">
    // So we need to look for kvg:element="..." where kvg:radical is present.

    // Simplistic regex approach:
    // Find groups that have kvg:radical attribute
    const radicalMatch = content.match(/<g[^>]*kvg:element="([^"]+)"[^>]*kvg:radical="[^"]+"[^>]*>/);

    if (radicalMatch && radicalMatch[1]) {
        return radicalMatch[1];
    }

    return null;
}

function main() {
    console.log("Loading Kanji DB...");
    const kanjiDb = JSON.parse(fs.readFileSync(KANJI_DB_PATH, 'utf8'));
    console.log(`Loaded ${kanjiDb.length} kanji.`);

    const categorizedData = {};

    // Initialize structure
    for (const group of Object.keys(CATEGORIES.CategoryRadicals)) {
        categorizedData[group] = {};
        for (const subGroup of Object.keys(CATEGORIES.CategoryRadicals[group])) {
            categorizedData[group][subGroup] = [];
        }
    }

    let matchCount = 0;

    for (const kanji of kanjiDb) {
        const radical = getRadicalFromSvg(kanji.char);

        if (radical && RADICAL_TO_CATEGORY[radical]) {
            const { group, subGroup } = RADICAL_TO_CATEGORY[radical];

            // Add kanji to the category
            categorizedData[group][subGroup].push(kanji);
            matchCount++;
        }
    }

    console.log(`Categorized ${matchCount} kanji.`);

    // Remove empty categories if needed? Or keep them empty.
    // Let's count them per category for info.
    for (const group of Object.keys(categorizedData)) {
        console.log(`\n[${group}]`);
        for (const subGroup of Object.keys(categorizedData[group])) {
            console.log(`  ${subGroup}: ${categorizedData[group][subGroup].length}`);
        }
    }

    console.log(`\nWriting to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(categorizedData, null, 2));
    console.log("Done.");
}

main();
