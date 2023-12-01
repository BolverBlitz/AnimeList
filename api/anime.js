const { Anime } = require('@lib/postgres');
const { limiter } = require('@middleware/limiter');
const HyperExpress = require('hyper-express');
const bcrypt = require('bcrypt');
const { DBError } = require('@lib/errors');
const router = new HyperExpress.Router();

/* Plugin info*/
const PluginName = 'Anime'; //This plugins name
const PluginRequirements = []; //Put your Requirements and version here <Name, not file name>|Version
const PluginVersion = '0.0.1'; //This plugins version

router.get('/', limiter(1), async (req, res) => {
    const sql_response = await Anime.Get.All();
    if (!sql_response) throw new DBError('Anime.Get.All', 1, typeof 1, sql_response, typeof sql_response);

    res.status(200);
    res.json(sql_response.rows);
});

module.exports = {
    router: router,
    PluginName: PluginName,
    PluginRequirements: PluginRequirements,
    PluginVersion: PluginVersion,
};