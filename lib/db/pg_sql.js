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
    rating int,
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
const GetAllAnimes = function () {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT id, anime, language, season, episodes, rating, watch_start, watch_end FROM animelist`, (err, result) => {
            if (err) { reject(err) }
            resolve(result);
        });
    });
}

const get = {
    Animes: {
        All: GetAllAnimes
    }
}

module.exports = {
    get: get
}