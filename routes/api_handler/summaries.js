/**
 * Created by Fyfar on 28.08.2014.
 */
var util = require('util');
var config = require('../../config/index');
var request = require('../requests');

//format yyyyMMdd
exports.getDay = function (req, res, next) {
    var uri = util.format("%s/user/summary/daily/%s?access_token=", config.get('moves_api:base_url'), req.params.date);
    request.makeRequest(req, uri, function (err, data) {
        if (err) next(err);
        res.send(data);
    });
};
// format yyyyMM
exports.getMonth = function (req, res, next) {
    var uri = util.format("%s/user/summary/daily/%s?access_token=", config.get('moves_api:base_url'), req.params.date);
    request.makeRequest(req, uri, function (err, data) {
        if (err) next(err);
        res.send(data);
    });
};
// form yyyyMMdd to yyyyMMdd
exports.getRangeDays = function (req, res, next) {
    if (req.query.from === undefined || req.query.to === undefined) res.redirect('/');

    var uri = util.format("%s/user/summary/daily?from=%s&to=%s&access_token=",
        config.get('moves_api:base_url'), req.query.from, req.query.to);
    request.makeRequest(req, uri, function (err, data) {
        if (err) next(err);
        res.send(data);
    });
};

exports.getPastDays = function (req, res, next) {
    var uri = util.format("%s/user/summary/daily?pastDays=%s&access_token=", config.get('moves_api:base_url'), req.params.count);
    request.makeRequest(req, uri, function (err, data) {
        if (err) next(err);
        res.send(data);
    });
};