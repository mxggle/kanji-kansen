
const BASE_URL = 'https://kanjiapi.dev/v1/kanji';

async function fetchKanjiDetails(char) {
    try {
        const response = await fetch(`${BASE_URL}/${encodeURIComponent(char)}`);
        if (!response.ok) {
            console.error(`Failed to fetch details for ${char}: ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error fetching ${char}:`, e);
    }
}

fetchKanjiDetails('海'); // "Sea" - should have Water radical
