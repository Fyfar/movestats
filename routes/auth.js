/**
 * Created by Fyfar on 27.08.2014.
 */
exports.get = function (req, res, next) {
    if (req.query.code) {
        res.redirect('/auth/access_token?code=' + req.query.code);
    } else if (req.query.error) {
        res.json(req.query);
        console.error(req.query.error);
    }
};