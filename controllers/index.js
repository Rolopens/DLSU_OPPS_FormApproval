module.exports.controller = function(app) {
    app.get('/', function(req, res) {
      if (req.session.uid) {
        res.redirect("/preacts");
      } else {
        res.render('index');
      }
    });
}
