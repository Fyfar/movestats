/**
 * Created by Fyfar on 28.08.2014.
 */
var config = require('../../config/index');
var request = require('../requests');


exports.get = function (req, res, next) {
    var uri = "https://api.moves-app.com/oauth/v1/tokeninfo?access_token=";
    request.makeRequest(uri, function (err, data) {
        if (err) next(err);
        res.send(data);
    });
};