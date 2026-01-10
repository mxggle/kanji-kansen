
import fs from 'fs';

const CSV_PATH = '../kanji_alive_media/language-data/japanese-radicals.csv';

function isStandard(char) {
    if (!char) return false;
    const code = char.charCodeAt(0);
    if (code >= 0xE000 && code <= 0xF8FF) return false;
    if (code >= 0x2F00 && code <= 0x2FDF) return false;
    if (code >= 0x2E80 && code <= 0x2EFF) return false;
    return true;
}

const MANUAL_BASE_MAP = {
    'sunzukuri': 'sun',
    'tahen': 'ta',
    'tsunohen': 'tsuno',
    'bo': 'hiko',
    'onnamusume': 'onna',
    'gonben': 'gen',
    'gyouninben': 'gyou', // gyou is usually 行 (row/go) which maps to 行
    'ninben': 'hito',
};

const CHAR_FIXES = {
    '⼨': '寸', '⽥': '田', '⾓': '角', '⺡': '氵', '⺘': '扌', '⺮': '⺮', '⼼': '心',
    '⺗': '⺗', '⽔': '水', '⽕': '火', '⺣': '灬', '⽊': '木', '⽉': '月', '⽬': '目',
    '⽯': '石', '⾦': '金', '⼟': '土', '⼿': '手', '⼥': '女', '⼦': '子', '⽷': '糸',
    '⾍': '虫', '⾒': '見', '⾏': '行', '⾔': '言', '⾝': '身', '⾞': '車', '⾨': '門',
    '⾬': '雨', '⾷': '食', '⾺': '馬', '⿃': '鳥', '⿂': '魚', '⾼': '高', '⻲': '亀',
    '⿓': '龍', '⻭': '歯', '⿊': '黒', '⻩': '黄', '⿇': '麻', '⿅': '鹿', '⿐': '鼻',
    '⿏': '鼠', '⿎': '鼓', '⼀': '一', '⼁': '丨', '⼂': '丶', '⼃': '丿', '⼄': '乙',
    '⼅': '亅', '⼆': '二', '⼇': '亠', '⼈': '人', '⼉': '儿', '⼊': '入', '⼋': '八',
    '⼌': '冂', '⼍': '冖', '⼎': '冫', '⼏': '几', '⼐': '凵', '⼑': '刀', '⼒': '力',
    '⼓': '勹', '⼔': '匕', '⼕': '匚', '⼗': '十', '⼘': '卜', '⼙': '卩', '⼚': '厂',
    '⼛': '厶', '⼜': '又', '⼝': '口', '⼞': '囗', '⼠': '士', '⼡': '夂', '⼢': '夊',
    '⼣': '夕', '⼤': '大', '⼩': '小', '⼫': '尸', '⼬': '屮', '⼭': '山', '⼮': '巛',
    '⼯': '工', '⼰': '己', '⼱': '巾', '⼲': '干', '⼴': '广', '⼵': '廴', '⼶': '廾',
    '⼷': '弋', '⼸': '弓', '⼹': '彐', '⼺': '彡', '⼻': '彳', '⼽': '戈', '⼾': '戸',
    '⼿': '手', '⽀': '支', '⽁': '攴', '⽂': '文', '⽃': '斗', '⽄': '斤', '⽅': '方',
    '⽆': '无', '⽇': '日', '⽈': '曰', '⽊': '木', '⽋': '欠', '⽌': '止', '⽍': '歹',
    '⽎': '殳', '⽏': '毋', '⽐': '比', '⽑': '毛', '⽒': '氏', '⽓': '气', '⽖': '爪',
    '⽗': '父', '⽘': '爻', '⽙': '爿', '⽚': '片', '⽜': '牛', '⽝': '犬', '⽞': '玄',
    '⽟': '玉', '⽠': '瓜', '⽡': '瓦', '⽢': '甘', '⽣': '生', '⽤': '用', '⽦': '疋',
    '⽧': '疒', '⽨': '癶', '⽩': '白', '⽪': '皮', '⽫': '皿', '⽭': '矛', '⽮': '矢',
    '⽰': '示', '⽱': '禸', '⽲': '禾', '⽳': '穴', '⽴': '立', '⽵': '竹', '⽶': '米',
    '⽷': '糸', '⽸': '缶', '⽹': '网', '⽺': '羊', '⽻': '羽', '⽼': '老', '⽽': '而',
    '⽾': '耒', '⽿': '耳', '⾁': '肉', '⾂': '臣', '⾃': '自', '⾄': '至', '⾅': '臼',
    '⾆': '舌', '⾇': '舛', '⾈': '舟', '⾉': '艮', '⾊': '色', '⾋': '艸', '⾌': '虍',
    '⾍': '虫', '⾎': '血', '⾏': '行', '⾐': '衣', '⾑': '襾', '⾒': '見', '⾓': '角',
    '⾔': '言', '⾕': '谷', '⾖': '豆', '⾗': '豕', '⾘': '豸', '⾙': '貝', '⾚': '赤',
    '⾛': '走', '⾜': '足', '⾝': '身', '⾞': '車', '⾟': '辛', '⾠': '辰', '⾡': '辶',
    '⾢': '邑', '⾣': '酉', '⾤': '釆', '⾥': '里', '⾦': '金', '⻑': '長', '⾨': '門',
    '⾩': '阜', '⾪': '隶', '⾫': '隹', '⾬': '雨', '⾭': '青', '⾮': '非', '⾯': '面',
    '⾰': '革', '⾲': '韭', '⾳': '音', '⾴': '頁', '⾵': '風', '⾶': '飛', '⾷': '食',
    '⾸': '首', '⾹': '香', '⾺': '馬', '⾻': '骨', '⾼': '高', '⾽': '髟', '⾾': '鬥',
    '⾿': '鬯', '⿀': '鬲', '⿁': '鬼', '⿂': '魚', '⿃': '鳥', '⿄': '鹵', '⿅': '鹿',
    '⿆': '麥', '⿇': '麻', '⻩': '黄', '⿊': '黒', '⻲': '亀', '⿍': '鼎', '⿎': '鼓',
    '⿏': '鼠', '⿐': '鼻', '⿑': '齊', '⻭': '歯', '⿓': '龍', '⿔': '龜', '⿕': '龠',
    '': '日', // hihen (sun)
    '': '木', // kihen (tree)
    '': '火', // hihen (fire)
    '': '八', // hachigashira
    '': '白', // hakuhen
    '': '王', // ouhen
    '': '走', // sounyou
    '': '戸', // todare
    '': '罒', // yokome
    '⼧': '宀', // ukanmuri
    '⼌ ': '冂', // keigamae (with space?)
    '⼌': '冂',  // keigamae
};

function main() {
    const content = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = content.split(/\r?\n/);

    const nameToStdChar = {}; // Temporary map: current processed Name -> Standard Char
    const charMap = {}; // Output: PUA/Kangxi Char -> Standard Char

    function parseCSVLine(line) {
        const fields = [];
        let currentField = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (inQuote) {
                if (char === '"') {
                    if (line[i + 1] === '"') { currentField += '"'; i++; }
                    else { inQuote = false; }
                } else { currentField += char; }
            } else {
                if (char === '"') { inQuote = true; }
                else if (char === ',') { fields.push(currentField); currentField = ''; }
                else { currentField += char; }
            }
        }
        fields.push(currentField);
        return fields;
    }

    // Pass 1: Handle explicit fixes and standards
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = parseCSVLine(lines[i]);
        const char = cols[2].trim();
        const name = cols[5];

        if (CHAR_FIXES[char]) {
            charMap[char] = CHAR_FIXES[char];
            nameToStdChar[name] = CHAR_FIXES[char];
        } else if (isStandard(char)) {
            nameToStdChar[name] = char;
        }
    }

    // Pass 2: Resolve others
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = parseCSVLine(lines[i]);
        const char = cols[2].trim();
        const name = cols[5];

        if (charMap[char]) continue; // Already mapped
        if (isStandard(char)) continue; // Standard, no need to map (or map identity?)

        // It is PUA and not in CHAR_FIXES
        let baseName = name;
        const suffixes = ['hen', 'kanmuri', 'tsukuri', 'nyou', 'tare', 'gamae', 'ashi', 'kamae', 'head', 'top', 'bottom', 'zukuri'];

        for (const s of suffixes) {
            if (name.endsWith(s) && name !== s) {
                const candidate = name.slice(0, -s.length);
                if (nameToStdChar[candidate]) {
                    baseName = candidate;
                    break;
                }
            }
        }

        if (MANUAL_BASE_MAP[name]) {
            baseName = MANUAL_BASE_MAP[name];
        }

        if (nameToStdChar[baseName]) {
            charMap[char] = nameToStdChar[baseName];
            nameToStdChar[name] = nameToStdChar[baseName]; // Store for future refs
        } else {
            // Failed to resolve
            // console.warn("Failed to resolve:", name, char);
        }
    }

    // Output only pure JSON
    console.log(JSON.stringify(charMap, null, 2));
}

main();
