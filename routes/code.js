/**
 * Created by Fyfar on 27.08.2014.
 */
var util = require('util');
var config = require('../config');


exports.get = function (req, res, next) {
    res.redirect(
        util.format('%s?response_type=code&client_id=%s&scope=%s',
            config.get('moves_api:auth_url'), config.get('moves_api:client_id'), 'default location activity')
    );
};