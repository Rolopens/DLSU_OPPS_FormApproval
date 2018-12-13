const path = require("path");
const duration = require("duration");
const fs = require('fs')

const userService = require(path.join(__dirname, "..", "models", "userService.js"));
const roleService = require(path.join(__dirname, "..", "models", "roleService.js"));
const orgService = require(path.join(__dirname, "..", "models", "orgService.js"));
const preactsService = require(path.join(__dirname, "..", "models", "preactsService.js"));
const processes = require(path.join(__dirname, "..", "configuration", "approvalProcess.json"))
const {
    Form
} = require(path.join(__dirname, "..", "models", "preactsForm.js"))


module.exports.controller = function (app) {
    app.get('/preacts', function (req, res) {
        // context is for which menu items to show
        // modify this depending on which user type
        // is in the session
        var roleID;
        //      var canSee = false;
        var canSee = false;
        if (!req.session.uid) res.redirect("/");

        userService.getUserWithId(req.session.uid).then((retUser) => {
            var roleId = retUser.user_roles[0].role_id; //FIX THIS LATER ON DEPENDING ON HOW MANY ORGS THEY HAVE
            roleService.getRoleWithId(roleId).then((retRole) => {
                if (retRole.name === "PROJECT_HEAD") {
                    res.redirect('/preacts-submission');
                } else {
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
                            res.render('preacts', {
                                preacts: true,
                                preactsSubmission: false,
                                accounts: canSee,
                                organization: canSee
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.redirect("/");
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                }
            }).catch((err) => {
                console.log("ERROR MESSAGE: Cannot find role with id " + roleId);
                console.log(err);
            });
        }).catch((err) => {
            console.log("ERROR MESSAGE: Cannot find user with id " + req.session.uid);
            console.log(err);
        });


    });
    
    //preacts page for submitters
    app.get('/preacts-submission', function (req, res) {
        if (!req.session.uid) res.redirect("/");
        userService.getUserWithId(req.session.uid).then((retUser) => {
            var roleId = retUser.user_roles[0].role_id; //FIX THIS LATER ON DEPENDING ON HOW MANY ORGS THEY HAVE
            roleService.getRoleWithId(roleId).then((retRole) => {
                if (retRole.name != "PROJECT_HEAD") {
                    res.redirect('/preacts');
                } else {
                    if (req.session.submissionError == true) {
                        res.render('preacts-submit', {
                            preacts: false,
                            preactsSubmission: true,
                            accounts: false,
                            organization: false,
                            submitSuccess: false,
                            submissionError: true
                        });
                        req.session.submissionError = false;
                    } else {
                        if (req.session.submissionValue == true) {
                            req.session.submissionValue = false;
                            res.render('preacts-submit', {
                                preacts: false,
                                preactsSubmission: true,
                                accounts: false,
                                organization: false,
                                submitSuccess: true,
                                submissionError: false
                            });

                        } else {
                            res.render('preacts-submit', {
                                preacts: false,
                                preactsSubmission: true,
                                accounts: false,
                                organization: false,
                                submitSuccess: false,
                                submissionError: false
                            });
                        }
                    }


                }
            }).catch((err) => {
                console.log("ERROR MESSAGE: Cannot find role with id " + roleId);
                console.log(err);
            });
        }).catch((err) => {
            console.log("ERROR MESSAGE: Cannot find user with id " + req.session.uid);
            console.log(err);
        });

    });
    
    fs.readdirSync('./controllers/preactsControllers').forEach(function (file) {
        if (file.substr(-3) == '.js') {
            route = require('./preactsControllers/' + file)
            route.controller(app)
        }
    })

   
}
