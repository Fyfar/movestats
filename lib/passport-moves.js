/**
 * Created by Fyfar on 04.09.2014.
 */
var util = require('util')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
    , InternalOAuthError = require('passport-oauth').InternalOAuthError;


function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://api.moves-app.com/oauth/v1/authorize';
    options.tokenURL = options.tokenURL || 'https://api.moves-app.com/oauth/v1/access_token';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'moves';
}

/**
 * Inherit from `MovesOAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
    var url = 'https://api.moves-app.com/api/1.1/user/profile';

    this._oauth2.get(url, accessToken, function (err, body, res) {
        if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

        try {
            var json = JSON.parse(body);

            var profile = { provider: 'moves' };

            profile.user_id = json.userId;
            profile.first_date = json.profile.firstDate;
            profile.current_time_zone = {
                id: json.profile.currentTimeZone.id,
                offset: json.profile.currentTimeZone.offset
            };
            profile.localization = {
                language: json.profile.localization.language,
                locale: json.profile.localization.locale,
                first_week_day: json.profile.localization.firstWeekDay,
                metric: json.profile.localization.metric
            };
            profile.calories_available = json.profile.caloriesAvailable;
            profile.platform = json.profile.platform;

            profile._raw = body;
            profile._json = json;

            done(null, profile);
        } catch(e) {
            done(e);
        }
    });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;