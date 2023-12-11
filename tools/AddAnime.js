const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('module-alias/register')
const readline = require('readline');
const { DBError } = require('@lib/errors');
const { Anime } = require('@lib/postgres');

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

const convertToTimestamp = (dateString) => {
    // Split the date into parts
    const parts = dateString.split(".");

    // Note: Months are 0-indexed in JavaScript (0 = January, 11 = December)
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Subtract 1 to adjust for 0-indexing
    const year = parseInt(parts[2], 10);

    // Create a date object
    const date = new Date(year, month, day);

    // Get the timestamp
    return date;
}


async function Questions() {
    const animename = await askQuestion("Anime name: ");
    const language = await askQuestion("Language (2 letter code): ");
    const season = await askQuestion("Season: ");
    const episodes = await askQuestion("Episodes: ");
    const watch_start_date = await askQuestion("watch_start (Date): ");
    const watch_end_data = await askQuestion("watch_end (Date): ");
    const rating_grafik = await askQuestion("Rating Grafik (1-100): ");
    const rating_story = await askQuestion("Rating Story (1-100): ");
    const rating_values = await askQuestion("Rating Values (1-100): ");
    const rating_character = await askQuestion("Rating Character (1-100): ");
    const rating_worldbuilding = await askQuestion("Rating Worldbuilding (1-100): ");

    // Convert to Date
    const watch_start = convertToTimestamp(watch_start_date);
    const watch_end = convertToTimestamp(watch_end_data);

    const sql_response = await Anime.Create.Anime(animename, language, season, episodes, rating_grafik, rating_story, rating_values, rating_character, rating_worldbuilding, watch_start, watch_end);
    if (!sql_response) throw new DBError('Anime.Create.Anime', 1, typeof 1, sql_response, typeof sql_response);

    console.log("Anime created!");
    process.exit(0);
}

Questions()