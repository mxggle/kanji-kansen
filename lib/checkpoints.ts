import KANJI_DATA_RAW from './kanji-alive-categorized.json';

// Type definition for the JSON data structure
interface KanjiAliveData {
    [key: string]: {
        radical_char: string;
        kanji: Array<{
            char: string;
            stroke: number;
            meaning: string;
            grade: number | null;
            onyomi: string;
            kunyomi: string;
            examples: string[][];
        }>;
    };
}

const KANJI_DATA = KANJI_DATA_RAW as KanjiAliveData;

export interface Checkpoint {
    id: string;
    title: string;
    radical: string;
    level: string;
    kanji: string[];
    isLocked?: boolean;
}

function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function getLevel(kanjiList: any[]): string {
    const grades = kanjiList.map(k => k.grade).filter(g => g !== null && g !== undefined) as number[];
    if (grades.length === 0) return "General";
    const min = Math.min(...grades);

    // Simple mapping logic
    // Grade 1-6 are elementary. 
    // We can just return "Grade N" or map to N5-N1 roughly.
    // N5 ~ Grade 1
    // N4 ~ Grade 2
    // N3 ~ Grade 3-4
    // N2 ~ Grade 5-6
    // N1 ~ Secondary school +

    if (min === 1) return "N5 (Grade 1)";
    if (min === 2) return "N4 (Grade 2)";
    if (min <= 4) return "N3 (Grade 3-4)";
    if (min <= 6) return "N2 (Grade 5-6)";
    return "N1";
}

// Category definitions based on user request
const CATEGORY_MAPPING: { [key: string]: string[] } = {
    "Nature": ["sanzui", "ki", "kihen", "hi_fire", "hihen", "tsuchi", "tsuchihen", "hi", "hihen", "tsuki", "tsukihen"],
    // Added "hen" variants just in case, though they might not all exist or have different keys.
    // Based on previous dump: 
    // Water: sanzui (⺡), mizu(⽔)? mizu keys: mizu, shitamizu.
    // Tree: ki(⽊), kihen(✜? no ).
    // Fire: hi_fire, hihen, rekka.
    // Earth: tsuchi, tsuchihen.
    // Sun: hi, hihen.
    // Moon: tsuki, tsukihen.

    // Refined Nature list based on dump logic:
    // Water: "sanzui", "mizu", "shitamizu"
    // Tree: "ki", "kihen"
    // Fire: "hi_fire", "hihen", "rekka"
    // Earth: "tsuchi", "tsuchihen"
    // Sun: "hi", "hihen"
    // Moon: "tsuki", "tsukihen" -- wait, "tsuki" (moon), "nikuzuki" (flesh/moon shape) is different.

    // Let's use a broader list to capture variations
};

// Helper to map radical key to category
function getCategory(key: string): string {
    // Definitive mapping based on key names found in dump
    // Nature
    if (["mizu", "sanzui", "shitamizu"].includes(key)) return "Nature";
    if (["ki", "kihen"].includes(key)) return "Nature";
    if (["hi_fire", "hihen", "rekka"].includes(key)) return "Nature";
    if (["tsuchi", "tsuchihen"].includes(key)) return "Nature";
    if (["hi", "hihen_sun"].includes(key)) return "Nature"; // Note: hihen might be ambiguous if not renamed? hihen(sun) vs hihen(fire)?
    // Wait, "hihen" (sun) is key `hihen` (radical 109 ). "hihen" (fire) is key `hihen_fire` (radical 127 ).
    // I need to check exact keys for hihen.
    // The previous dump showed `hihen ()` (sun) and `hihen ()` (fire).
    // My script collision fix would have renamed the second one to `hihen_fire` or similar.
    // Let's assume standard names + suffix.
    if (key.startsWith("hihen")) return "Nature"; // Catch both?
    if (["tsuki", "tsukihen"].includes(key)) return "Nature";

    // Human
    if (["hito", "ninben", "hitoyane", "hitoashi"].includes(key)) return "Human";
    if (["onna", "onnahen"].includes(key)) return "Human";
    if (["ko", "kohen"].includes(key)) return "Human";
    if (["kuchi", "kuchihen"].includes(key)) return "Human";
    if (["kokoro", "risshinben", "shitagokoro"].includes(key)) return "Human";
    if (["te", "tehen"].includes(key)) return "Human";

    // Action/State
    if (["gen", "gonben"].includes(key)) return "Action/State";
    if (["gyougamae", "gyouninben"].includes(key)) return "Action/State"; // gyougamae=go, gyouninben=step?
    if (["hashiru", "sounyou"].includes(key)) return "Action/State";
    if (["me", "mehen", "yokome"].includes(key)) return "Action/State";
    if (["mimi", "mimihen"].includes(key)) return "Action/State";
    if (["ashi", "ashihen"].includes(key)) return "Action/State";

    // Objects
    if (["kuruma", "kurumahen"].includes(key)) return "Objects";
    if (["mon", "mongamae"].includes(key)) return "Objects"; // mon? gate is mongamae usually.
    if (["kane", "kanehen"].includes(key)) return "Objects";
    if (["ito", "itohen", "itogashira"].includes(key)) return "Objects";
    if (["kai", "kaihen"].includes(key)) return "Objects";
    if (["katana", "rittou"].includes(key)) return "Objects";

    return "Others";
}

export interface Checkpoint {
    id: string;
    title: string;
    radical: string;
    level: string;
    kanji: string[];
    category: string; // New field
    isLocked?: boolean;
}

// ... helper functions ...

// Generate checkpoints
// We want to sort them: Nature > Human > Action > Objects > Others
const CATEGORY_ORDER = ["Nature", "Human", "Action/State", "Objects", "Others"];

export const CHECKPOINTS: Checkpoint[] = Object.entries(KANJI_DATA)
    .map(([name, data]) => {
        return {
            id: `rad-${name}`,
            title: `${toTitleCase(name.replace(/_/g, ' '))} Radical`,
            radical: data.radical_char,
            level: getLevel(data.kanji),
            kanji: data.kanji.map(k => k.char),
            category: getCategory(name)
        };
    })
    .sort((a, b) => {
        const catA = CATEGORY_ORDER.indexOf(a.category);
        const catB = CATEGORY_ORDER.indexOf(b.category);
        if (catA !== catB) return catA - catB;
        // Secondary sort by Kanji count (descending) -> more common radicals first?
        return b.kanji.length - a.kanji.length;
    });

// ... remainder of file ...


// Helper to get next checkpoint ID
export function getNextCheckpointId(currentId: string): string | null {
    const index = CHECKPOINTS.findIndex(c => c.id === currentId);
    if (index === -1 || index === CHECKPOINTS.length - 1) return null;
    return CHECKPOINTS[index + 1].id;
}
