
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_FILE = path.join(__dirname, '../lib/kanji-alive-categorized.json');
const OUTPUT_FILE = path.join(__dirname, '../lib/radical-category-map.json');

const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

// Categories and their keywords
const CATEGORIES = {
    "Nature & Elements": [
        "water", "tree", "fire", "earth", "sun", "moon", "rain",
        "mountain", "stone", "wind", "ice", "river", "field", "cave", "cliff",
        "star", "sky", "vapor", "seed", "sprout", "flower", "melon", "hemp",
        "branch", "root", "valley", "steam", "smoke"
    ],
    "Human Body & People": [
        "person", "woman", "child", "mouth", "heart", "hand", "eye", "foot",
        "body", "face", "hair", "head", "ear", "nose", "tooth", "tongue", "skin",
        "bone", "blood", "flesh", "old", "man", "mother", "father", "baby", "pregnant",
        "sickness", "illness", "disease", "corpse", "skeleton"
    ],
    "Action & Movement": [
        "go", "run", "walk", "strike", "power", "stand", "stop",
        "step", "move", "fly", "enter", "exit", "climb", "see", "speak", "eat",
        "fight", "kill", "die", "birth", "hand", "leg",
        "work", "attack", "arrive", "reach", "mix", "yawn", "lack"
    ],
    "Structures & Home": [
        "roof", "building", "enclosure", "gate", "door", "village",
        "house", "canopy", "dwelling", "wall", "town", "capital",
        "box", "container", "tile", "window", "room"
    ],
    "Animals & Wildlife": [
        "animal", "dog", "bird", "fish", "insect", "horse", "cow", "shell",
        "tiger", "dragon", "snake", "mouse", "rat", "sheep", "turtle", "deer", "pig",
        "bear", "claw", "feather", "fur", "horn", "fang", "beast", "badger"
    ],
    "Tools & Weapons": [
        "sword", "car", "metal", "gold", "bow", "arrow", "boat", "plate",
        "knife", "axe", "spear", "halberd", "drum", "net", "plow", "vehicle",
        "measure", "shield", "flag", "clothes", "javelin", "stamp", "seal",
        "split wood", "wood", "tool", "brush", "turban", "napkin", "sash"
    ],
    "Communication & Thought": [
        "speech", "spirit", "writing", "sound", "measurement",
        "say", "word", "compare", "divination", "number", "oracle",
        "cultivate", "ceremony", "ritual", "worship"
    ],
    "Textiles, Plants & Food": [
        "grass", "thread", "clothing", "food", "rice", "bamboo", "grain",
        "wheat", "bean", "millet", "wine", "alcohol", "herb", "cloth", "silk", "leather",
        "scent", "fragrance", "salt", "eat"
    ],
    "States & Attributes": [
        "sickness", "illness", "white", "red", "blue", "yellow", "black",
        "color", "high", "long", "short", "big", "small", "dark", "fast", "slow",
        "sweet", "sour", "bitter", "wrong", "non-", "young", "slight", "private", "beauty"
    ],
    "Time & Sequence": [
        "evening", "morning", "day", "night", "time", "again", "self", "period",
        "one", "two", "eight", "ten", "small"
    ]
};

// Override/Specific mapping for known ambiguous keys
const OVERRIDES = {
    // Examples provided by user
    "sanzui": "Nature & Elements",
    "ki": "Nature & Elements",
    "hi_fire": "Nature & Elements",
    "tsuchi": "Nature & Elements",
    "hi": "Nature & Elements",
    "tsuki": "Nature & Elements",
    "ame": "Nature & Elements",

    "hito": "Human Body & People",
    "onna": "Human Body & People",
    "ko": "Human Body & People",
    "kuchi": "Human Body & People",
    "kokoro": "Human Body & People",
    "te": "Human Body & People",

    "gen": "Communication & Thought",
    "hashiru": "Action & Movement",
    "chikara": "Action & Movement",

    "yamai": "States & Attributes",
    "shiro": "States & Attributes",
    "aka": "States & Attributes",
    "ao": "States & Attributes",

    "yuube": "Time & Sequence",

    // Fixes for unknowns
    "akubi": "Action & Movement", // yawn
    "arazu": "States & Attributes", // wrong
    "boku": "Communication & Thought", // oracle
    "fushizukuri": "Tools & Weapons", // stamp
    "hachi": "Time & Sequence", // eight
    "hachigashira": "Time & Sequence", // eight
    "hakogamae": "Structures & Home", // box
    "hanebou": "Tools & Weapons", // stroke/shape -> often simplified brush? Or just "Tools" as abstract.
    "ichi": "Time & Sequence", // one
    "igurumi": "Tools & Weapons", // javelin
    "itaru": "Action & Movement", // arrive
    "itogashira": "States & Attributes", // young/slight
    "juu": "Time & Sequence", // ten
    "kannyou": "Structures & Home", // container
    "kaori": "Textiles, Plants & Food", // scent
    "kata": "Tools & Weapons", // split wood
    "katahen": "Tools & Weapons",
    "kawara": "Structures & Home", // tile
    "keigamae": "Structures & Home", // enclose
    "kemonohen": "Animals & Wildlife",
    "kibi": "Textiles, Plants & Food", // millet
    "kin": "Tools & Weapons", // metal/gold
    "komemushi": "Textiles, Plants & Food", // rice
    "komehen": "Textiles, Plants & Food", // rice
    "koromo": "Textiles, Plants & Food", // clothing - or Tools? User put Clothing in Textiles.
    "koromohen": "Textiles, Plants & Food",
    "koushi": "Action & Movement", // mix/cross

    "kozato": "Nature & Elements", // hill
    "ozato": "Structures & Home", // village -> user put village in structure? Actually ozato is village.
    "kozatohen": "Nature & Elements", // hill
    "ozatohen": "Structures & Home", // village (technically right radical is usually town/village)

    // Remaining Unknowns
    "kinyou": "Structures & Home", // table -> Furniture -> Structure/Home? Or Tools? lets go Structure/Home ("Home")
    "kon": "Structures & Home", // boundary -> State? Or Structure (Wall)? Let's go Structure.
    "kunigamae": "Structures & Home", // border/territory
    "maiashi": "States & Attributes", // contrary/err
    "mochiiru": "Action & Movement", // to use
    "n/a": "States & Attributes", // 々 repetition -> State/Time? Time & Sequence has "again".
    "nabebuta": "Tools & Weapons", // lid
    "nishi": "Nature & Elements", // West? Direction. Nature? Time? Let's go Nature (Sun sets).
    "nomata": "Action & Movement", // to follow
    "otsu": "Time & Sequence", // second
    "otsu_the_second": "Time & Sequence",
    "ouhen": "Tools & Weapons", // jewelry
    "rumata": "Tools & Weapons", // lance shaft
    "saji": "Tools & Weapons", // spoon
    "shin": "Human Body & People", // retainer/minister -> People
    "shinnotatsu": "Time & Sequence", // Zodiac/Time
    "tama": "Tools & Weapons", // jewelry
    "tsu": "Communication & Thought", // Katakana -> Writing
    "tsutsumigamae": "Action & Movement", // to wrap -> Action
    "uji": "Human Body & People", // clan -> People
    "umahen": "Animals & Wildlife", // horse
    "usu": "Tools & Weapons", // mortar
    "wakanmuri": "Tools & Weapons", // crown
    "ya": "Tools & Weapons", // arrow -> listed in Tools.
    "yahen": "Tools & Weapons",
    "yokome": "Human Body & People", // eye
    "yumi": "Tools & Weapons", // bow -> listed in Tools.
    "yumihen": "Tools & Weapons",

    // Catch-alls that might fail checks
    "tori": "Animals & Wildlife",
    "torihen": "Animals & Wildlife",
};

const mapping = {};
const unknown = [];

for (const [key, val] of Object.entries(data)) {
    // 1. Check override
    if (OVERRIDES[key]) {
        mapping[key] = OVERRIDES[key];
        continue;
    }
    if (OVERRIDES[val.radical_char]) {
        mapping[key] = OVERRIDES[val.radical_char];
        continue;
    }

    // 2. Check keywords in key name, radical name, and radical meaning
    const textToSearch = `${key} ${val.radical_meaning || ''}`.toLowerCase();

    let bestMatch = null;

    // Heuristic: Check Category Keywords
    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        for (const kw of keywords) {
            // Whole word match preferrable, but substring ok for now
            if (textToSearch.includes(kw)) {
                // Heuristic: "speech" -> Communications. "speak" -> Action?
                // Let's rely on the order of checks roughly.
                // Or find first match.
                bestMatch = cat;
                break;
            }
        }
        if (bestMatch) break;
    }

    if (bestMatch) {
        mapping[key] = bestMatch;
    } else {
        // Fallback for shapes
        if (val.radical_meaning && val.radical_meaning.includes("stroke")) {
            mapping[key] = "Tools & Weapons"; // Abstract shapes -> Writing -> Comm? Or Tools?
            // Let's put abstract shapes in "Time & Sequence" or a new "Shapes" category?
            // User didn't ask for Shapes.
            // Maybe "Tools & Weapons" as "Writing Instruments"?
        } else {
            unknown.push({ key, char: val.radical_char, meaning: val.radical_meaning });
            mapping[key] = "States & Attributes"; // Default bucket for oddballs?
        }
    }
}

console.log("Mapped:", Object.keys(mapping).length);
console.log("Unknown:", unknown.length);

if (unknown.length > 0) {
    console.log("First 20 Unknowns:");
    unknown.slice(0, 20).forEach(u => console.log(`${u.key} (${u.char}): ${u.meaning}`));
}

// Write the map
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));
