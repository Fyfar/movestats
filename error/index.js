/**
 * Created by Fyfar on 27.08.2014.
 */
var util = require('util');
var http = require('http');

function HttpError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.statusCode || "Unknown http error :( ";
}

util.inherits(HttpError, Error);
HttpError.prototype.name = "HttpError";
exports.HttpError = HttpError;