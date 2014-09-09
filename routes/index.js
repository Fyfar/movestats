var passport = require('passport');

module.exports = function(app) {

    app.get('/', require('./frontpage').get);

    app.get('/auth/moves', passport.authenticate('moves', {scope: ['default', 'location', 'activity']}));

    /*app.get('/auth/access_token', require('./token/get').get);

    app.get('/auth/valid_token', require('./token/valid').get);

    app.get('/auth/refresh_token', require('./token/refresh').get);

    app.get('/auth/code', require('./code').get);*/

//    app.get('/auth/moves/callback', require('./auth').get);

    app.get('/auth/moves/callback', passport.authenticate('moves', {successRedirect: '/'}));

    app.get('/auth/logout', require('./logout').get);

    app.get('/api/profile', require('./api_handler/profile').get);

    app.get('/api/summaries/day/:date', require('./api_handler/summaries').getDay);

    app.get('/api/summaries/month/:date', require('./api_handler/summaries').getMonth);

    app.get('/api/summaries/range', require('./api_handler/summaries').getRangeDays);

    app.get('/api/summaries/past_days/:count', require('./api_handler/summaries').getPastDays);

    app.get('/api/places/day/:date', require('./api_handler/places').getDay);

    app.get('/api/places/month/:date', require('./api_handler/places').getMonth);

    app.get('/api/places/range', require('./api_handler/places').getRangeDays);

    app.get('/api/places/past_days/:count', require('./api_handler/places').getPastDays);

    app.get('/test', function (req, res, next) {
        res.render('test')
    });

    app.get('*', function (req, res, next) {
        next(404);
    });

};
