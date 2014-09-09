/**
 * Created by Fyfar on 27.08.2014.
 */
exports.get = function(req, res, next) {
    res.render('index', {title: 'Express'});
};