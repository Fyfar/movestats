/**
 * Created by Fyfar on 28.08.2014.
 */
var util = require('util');
var config = require('../../config');
var request = require('./../requests');


exports.get = function (req, res, next) {
    var uri = util.format("%s/user/profile?access_token=", config.get('moves_api:base_url'));
    request.makeRequest(req, uri, function (err, data) {
        if (err) next(err);
        res.send(data);
    });
};