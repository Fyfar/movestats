/**
 * Created by Fyfar on 28.08.2014.
 */
var https = require('https');
var async = require('async');
var logger = require('winston');
var config = require('../config/index');
var Token = require('../models/user').Token;
var HttpError = require('../error/index').HttpError;


exports.makeRequest = function (req, uri, cb) {
    async.waterfall([
        function (callback) {
            Token.findOne({user_id: req.user.user_id}, function (err, token) {
                if (!token || token === undefined) callback(new HttpError(403, 'Access token'));
                callback(null, token.access_token);
            });
        },
        function (token, callback) {
            var finish_url = uri + token;
            https.get(finish_url, function (res) {
                res.on('data', function (chunk) {
                    callback(null, JSON.parse(chunk));
                })
            });
        }
    ], function (err, result) {
        process.nextTick(function () {
            cb(err, result);
        });
    })
};