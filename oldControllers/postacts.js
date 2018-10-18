module.exports.controller = function(app) {
    app.get('/postacts', function(req, res) {
        res.render('postacts')
    });
}