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
    parentRadicalSize?: number; // Total count for the radical across all parts
    category: string;
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

import CATEGORY_MAP_RAW from './radical-category-map.json';

const CATEGORY_MAP = CATEGORY_MAP_RAW as Record<string, string>;

// Helper to map radical key to category
function getCategory(key: string): string {
    return CATEGORY_MAP[key] || "Others";
}

// Generate checkpoints
// Generate checkpoints
// We want to sort them by Category Priority
export const CATEGORIES = [
    "Nature & Elements",
    "Human Body & People",
    "Action & Movement",
    "Structures & Home",
    "Animals & Wildlife",
    "Tools & Weapons",
    "Communication & Thought",
    "Textiles, Plants & Food",
    "States & Attributes",
    "Time & Sequence",
    "Others"
] as const;

export type CategoryName = typeof CATEGORIES[number];

export function getCategorySlug(category: string): string {
    return category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/,/g, '');
}

export function getCategoryFromSlug(slug: string): string | undefined {
    return CATEGORIES.find(c => getCategorySlug(c) === slug);
}

const MAX_ITEMS = 10;

function romanize(num: number): string {
    if (num === 1) return "I";
    if (num === 2) return "II";
    if (num === 3) return "III";
    if (num === 4) return "IV";
    if (num === 5) return "V";
    if (num === 6) return "VI";
    return String(num);
}

// Helper to map Grade to JLPT Level (Approximate)
function getJLPTLevel(grade: number | null): string {
    if (grade === 1) return "N5";
    if (grade === 2) return "N4";
    if (grade === 3 || grade === 4) return "N3";
    if (grade === 5 || grade === 6) return "N2";
    return "N1";
}

const LEVEL_ORDER = ["N5", "N4", "N3", "N2", "N1"];

export const CHECKPOINTS: Checkpoint[] = Object.entries(KANJI_DATA)
    .flatMap(([name, data]) => {
        // 1. Group by Level
        const byLevel: Record<string, typeof data.kanji> = {
            "N5": [], "N4": [], "N3": [], "N2": [], "N1": []
        };

        data.kanji.forEach(k => {
            const lvl = getJLPTLevel(k.grade);
            byLevel[lvl].push(k);
        });

        const category = getCategory(name);
        const baseTitle = `${toTitleCase(name.replace(/_/g, ' '))} Radical`;
        let relativeIndex = 0;

        // 2. Process levels in order
        return LEVEL_ORDER.flatMap(level => {
            const kanjiInLevel = byLevel[level];
            if (kanjiInLevel.length === 0) return [];

            // Sort by stroke within level
            kanjiInLevel.sort((a, b) => a.stroke - b.stroke);

            // Chunk if necessary
            const chunks = [];
            for (let i = 0; i < kanjiInLevel.length; i += MAX_ITEMS) {
                chunks.push(kanjiInLevel.slice(i, i + MAX_ITEMS));
            }

            return chunks.map((chunk, chunkIndex) => {
                const isMultiChunk = chunks.length > 1;
                // ID needs to be unique. using level and chunk index.
                // format: rad-name-n5, rad-name-n5-2 
                const idSuffix = isMultiChunk ? `-${level.toLowerCase()}-${chunkIndex + 1}` : `-${level.toLowerCase()}`;
                const id = `rad-${name}${idSuffix}`;

                // Title: Water Radical (N5) or Water Radical (N5) Part I
                let title = `${baseTitle} (${level})`;
                if (isMultiChunk) {
                    title += ` ${romanize(chunkIndex + 1)}`;
                }

                return {
                    id,
                    title,
                    radical: data.radical_char,
                    level: level, // Explicit level for this chunk
                    kanji: chunk.map(k => k.char),
                    category,
                    parentRadicalSize: data.kanji.length // Total radical size for sorting parent
                } as Checkpoint & { parentRadicalSize: number };
            });
        });
    })
    .sort((a, b) => {
        const catA = CATEGORIES.indexOf(a.category as any);
        const catB = CATEGORIES.indexOf(b.category as any);
        if (catA !== catB) return catA - catB;

        // Secondary Sort: JLPT Level (N5 -> N1)
        const levelA = LEVEL_ORDER.indexOf(a.level.split(' ')[0]); // Handle "N5" from "N5 (Grade 1)" if structure varies, but we set strictly "N5" etc above.
        const levelB = LEVEL_ORDER.indexOf(b.level.split(' ')[0]);
        // Note: our getLevel returns just "N5", "N4" etc in the map above, 
        // but let's be safe if it includes " (Grade X)" suffix (it doesn't in the new logic).
        // Actually, the chunking logic sets `level: level` which is just "N5".

        if (levelA !== levelB) return levelA - levelB;

        // Tertiary Sort: Parent Radical Size (descending) - Keep bigger/more common radicals first within the level
        const sizeA = a.parentRadicalSize || 0;
        const sizeB = b.parentRadicalSize || 0;
        if (sizeB !== sizeA) return sizeB - sizeA;

        // Or just don't sort again if equal?
        return 0;
    });


// Helper to get next checkpoint ID
export function getNextCheckpointId(currentId: string): string | null {
    const index = CHECKPOINTS.findIndex(c => c.id === currentId);
    if (index === -1 || index === CHECKPOINTS.length - 1) return null;
    return CHECKPOINTS[index + 1].id;
}
