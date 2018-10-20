const path = require("path");

const userService = require(path.join(__dirname, "..", "models", "userService.js"));
const roleService = require(path.join(__dirname, "..", "models", "roleService.js"));
const preactsService = require(path.join(__dirname, "..", "models", "preactsService.js"));
const {
    Form
} = require(path.join(__dirname, "..", "models", "preactsForm.js"))
var canSee = false;

module.exports.controller = function (app) {
    app.get('/preacts', function (req, res) {
        // context is for which menu items to show
        // modify this depending on which user type
        // is in the session
        var roleID;
        //      var canSee = false;
        userService.getUserWithId(req.session.uid)
            .then((result) => {
                var rolePromises = [];
                for (var i = 0; i < result.user_roles.length; i++) {
                    roleID = result.user_roles[i].role_id;
                    var p = roleService.getRoleWithId(roleID).then((result) => {
                        if (result.name === "DIRECTOR" || result.name === "HEAD" || result.name === "PRESIDENT")
                            canSee = true;
                    });
                    rolePromises.push(p);
                }
                return Promise.all(rolePromises);
            })
            .then((result) => {
                preactsService.getAllForms().then((results) => {
                    res.render('preacts', {
                        preacts: true,
                        postacts: true,
                        accounts: canSee,
                        organization: canSee,
                        forms: results
                    });
                })
            });
    });
    //preacts page for submitters
    app.get('/preacts-submission', function (req, res) {

        res.render('preacts-submit', {
            preacts: true,
            postacts: true,
            accounts: canSee,
            organization: canSee
        });
        //}
    });
    app.post('/preacts-submission', function (req, res) {
        var form = new Form({
            "title": req.body.title,
            "nature": req.body.nature,
            "typeOfActivity": req.body.type,
            "enmp": req.body.enmp,
            "enp": req.body.enp,
            "startDate": new Date(req.body.dateOfActivity),
            "venue": req.body.venue,
            "context": req.body.context,
            "objectives": [req.body.objective1, req.body.objective2, req.body.objective3],
            "state": req.body.state,
            "comments": null,
            "position": null,
            "projectHeads": [{
                "name": req.body.phead,
                "contact_number": req.body.cnumber
            }],
            "creationDate": new Date,
            "org": req.body.org,
            "position": "Documents Committee",
            "status": "Pending"
        });
        //        if(req.session.uid == null){
        //            resp.redirect('/');
        //        } else {
        preactsService.addForm(form);
        res.render('preacts-submit', {
            preacts: true,
            postacts: true,
            accounts: canSee,
            organization: canSee
        });
        //}
    });
}
