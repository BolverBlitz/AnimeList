const pg = require('pg');
const { logger } = require('../logger');

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

pool.query(`CREATE TABLE IF NOT EXISTS animelist (
    id serial PRIMARY KEY,
    anime text,
    language text,
    season int,
    episodes int,
    rating_grafik int,
    rating_story int,
    rating_values int,
    rating_character int,
    watch_start TIMESTAMP WITH TIME ZONE,
    watch_end TIMESTAMP WITH TIME ZONE,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`, (err) => {
    if (err) { logger('error', `Table-gen: Error animelist ${err}`) }
});

/*
    |-------------------------------------------------------------------------------|
    |                                                                               |
    |                             Anime - Managment                                 |
    |                                                                               |
    |-------------------------------------------------------------------------------|
*/

/**
 * Will return all animes from the database
 * @returns {Promise}
 */
const GetAllAnimes = () => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT id, anime, language, season, episodes, (rating_grafik + rating_story + rating_values + rating_character) / 4 AS average_rating,watch_start, watch_end FROM animelist ORDER BY anime ASC;`, (err, result) => {
            if (err) { reject(err) }
            resolve(result);
        });
    });
}

/**
 * Create a new anime in the database
 * @param {string} anime
 * @param {string} language
 * @param {number} season
 * @param {number} episodes
 * @param {number} rating_grafik
 * @param {number} rating_story
 * @param {number} rating_values
 * @param {number} rating_character
 * @param {Date} watch_start
 * @param {Date} watch_end
 * @returns {Promise}
 */
const CreateAnime = (anime, language, season, episodes, rating_grafik, rating_story, rating_values, rating_character, watch_start, watch_end) => {
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO animelist (anime, language, season, episodes, rating_grafik, rating_story, rating_values, rating_character, watch_start, watch_end) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [anime, language, season, episodes, rating_grafik, rating_story, rating_values, rating_character, watch_start, watch_end], (err, result) => {
            if (err) { reject(err) }
            resolve(result);
        });
    });
}

const Anime = {
    Get: {
        All: GetAllAnimes
    },
    Create: {
        Anime: CreateAnime
    }
}

module.exports = {
    Anime: Anime
}