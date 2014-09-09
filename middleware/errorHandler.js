/**
 * Created by Fyfar on 28.08.2014.
 */
var sendHttpError = function (error, res) {
    res.status(error.status);

    if (res.req.xhr) {
        res.json(error);
    } else {
        res.render('error', {error: error});
    }
};

module.exports = function (app) {
    var HttpError = require('../error').HttpError;
    var errorhandler = require('errorhandler');

    return function (err, req, res, next) {
        if (typeof err == 'number') {
            err = new HttpError(err);
        }

        if (err instanceof HttpError) {
            sendHttpError(err, res);
        } else if (!err) {
            next();
        } else {
            if (app.get('env') == 'development') {
                errorhandler()(err, req, res, next);
            } else {
                console.error(err);
                err = new HttpError(500);
                sendHttpError(err, res);
            }
        }
    }
};