/**
 * Created by Fyfar on 27.08.2014.
 */
var util = require('util');
var request = require('../requests');
var config = require('../../config/index');
var User = require('../../models/user').User;


exports.get = function (req, res, next) {
    var token_url = util.format(
        '%s?grant_type=authorization_code&code=%s&client_id=%s&client_secret=%s&redirect_uri=%s',

        config.get('moves_api:access_token_url'),
        req.query.code,
        config.get('moves_api:client_id'),
        config.get('moves_api:client_secret'),
        config.get('moves_api:redirect_url')
    );
    request.post(token_url, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                addToken(JSON.parse(body));
                res.redirect('/');
            } else if (response.statusCode === 400) {
                console.error(body);
                res.send(body);
            }
        });
};

function addToken(body) {
    User.findOne({user_id: body.user_id}, function (err, token) {
        if (!err) {
            if (!token || token === undefined) {
                var token = new Token(body);
                token.createdAt.expire = body.expires_in;
                token.save();
            }
        }
    })
}