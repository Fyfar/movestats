/**
 * Created by Fyfar on 30.08.2014.
 */
var passport = require('passport'),
    MovesOAuth2Strategy = require('./passport-moves');
var config = require('../config');
var User = require('../models/user').User;
var Token = require('../models/user').Token;

passport.use('moves', new MovesOAuth2Strategy({
    clientID: config.get('moves_api:client_id'),
    clientSecret: config.get('moves_api:client_secret'),
    callbackURL: config.get('moves_api:callback_url')
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({user_id: profile.user_id}, function (err, user) {
        if (!err) {
            if (!user) {
                user = new User(profile);
                user.save(function (err) {
                    var token = new Token({
                        user_id: profile.user_id,
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });
                    token.save(function (err) {
                        return done(null, user);
                    });
                });
            } else {
                return done(null, user);
            }
        } else {
            return done(err);
        }
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) done(err);

        done(null, user);
    });
});

module.exports = function (app) {
};