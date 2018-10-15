let preactsService = require('./../models/preactsService')
let {
    Form
} = require('./../models/preactsForm')

module.exports.controller = function (app) {

    //for approvers
    app.get('/preacts', function (req, res) {
        res.render('preacts')
    });

    //preacts page for submitters
    app.get('/preacts-submission', function (req, res) {
        
        res.render('preacts-submit');
        //}
    });
    
    app.post('/preacts-submission', function (req, res) {
        var form = new Form({
            "title": req.body.title,
            "nature": req.body.nature,
            "typeOfActivity": req.body.type,
            "enmp": req.body.enmp,
            "enp": req.body.enp,
            "date": new Date(req.body.dateOfActivity),
            "venue": req.body.venue,
            "context": req.body.context,
            "objectives": [req.body.objective1, req.body.objective2, req.body.objective3],
            "state": req.body.state, 
            "comments": null, 
            "position": null, 
            "projectHeads": [{
                "name": req.body.phead,
                "contact_number": req.body.cnumber
            }]
        });
        //        if(req.session.uid == null){
        //            resp.redirect('/');
        //        } else {
        preactsService.addForm(form);
        res.render('preacts-submit');
        //}
    });
}
