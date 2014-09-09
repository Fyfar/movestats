/**
 * Created by Fyfar on 04.09.2014.
 */
exports.get = function (req, res, next) {
    req.logout();
    res.redirect('/');
};