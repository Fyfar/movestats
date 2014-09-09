/**
 * Created by Fyfar on 04.09.2014.
 */
module.exports = function (req, res, next) {
    if (!req.user || req.user === 'undefined') res.locals.user = null;
    if (req.user) res.locals.user = req.user;

    next();
};