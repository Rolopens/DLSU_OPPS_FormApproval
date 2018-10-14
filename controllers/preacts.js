let preactsService = require('./../models/preactsService')

module.exports.controller = function(app) {
    
    //for approvers
    app.get('/preacts', function(req, res) {
        res.render('preacts')
    });
    
    //preacts page for submitters
    app.get('/preacts-submission', function(req, res) {
//        if(req.session.uid == null){
//            resp.redirect('/');
//        } else {
            res.render('preacts-submit');
        //}
    });
}