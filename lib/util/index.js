const randomstring = require('randomstring');

/**
 * Generates a random string
 * @param {Number} [length] Default: 64
 * @returns {String}
 */
const randomString = (length = 64) => {
    return randomstring.generate({
        length: length,
        charset: 'alphanumeric'
    });
};


module.exports = {
    randomString: randomString
}