
import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./lib/kanji-alive-categorized.json', 'utf8'));
const key = Object.keys(data).find(k => k.toLowerCase().includes('kihen'));
if (key) {
    console.log(`Key: ${key}`);
    console.log('Data:', JSON.stringify(data[key], null, 2));
    console.log(`Radical Char Code: ${data[key].radical_char.charCodeAt(0)}`);
} else {
    console.log('Kihen not found');
}
