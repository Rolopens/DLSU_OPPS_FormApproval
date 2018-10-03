module.exports.controller = function (app) {
    app.get('/test', function(req, res) {
	   res.render('test')
    });
}