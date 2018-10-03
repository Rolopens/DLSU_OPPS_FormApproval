module.exports.controller = function(app) {
    app.get('/preacts', function(req, res) {
        res.render('preacts')
    });
}