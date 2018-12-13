const path = require("path");
const duration = require("duration");
const fs = require('fs')

const userService = require(path.join(__dirname, "..", "..", "models", "userService.js"));
const roleService = require(path.join(__dirname, "..", "..", "models", "roleService.js"));
const orgService = require(path.join(__dirname, "..", "..", "models", "orgService.js"));
const preactsService = require(path.join(__dirname, "..", "..", "models", "preactsService.js"));
const processes = require(path.join(__dirname, "..", "..", "configuration", "approvalProcess.json"))
const {
    Form
} = require(path.join(__dirname, "..", "..", "models", "preactsForm.js"))

module.exports.controller = function (app){
    //ajax request for getting orgs of user
    app.get("/preacts/userOrgs/:id", function (req, res) {
        userService.getUserWithId(req.paramas.id).then((userObject) => {
            var org_ids = userObject.user_roles;
            console.log("LOG: USER OBJECT")
            return orgService.findSpecificOrg(org_id).then((orgObject) => {
                usersOrganization = orgObject.name;
                res.send({
                    org_ids
                })
            }).catch((err) => {
                console.log("ERROR: Failed to find organizations given org_id - " + org_id);
                console.log(err);
            });
        }).catch((err) => {
            console.log("ERROR: Failed to find user given user_id - " + req.session.uid);
            console.log(err);
        });
    });

    //ajax request for quick view
    app.get("/preacts/:id", function (req, res) {
        var id = req.params.id

        preactsService.findFormViaId(id).then((form) => {
            res.send({
                form
            })
        })
    });

    //ajax request for all the forms
    //    app.get("/preacts/getAllForms/forms", function (req, res) {
    //        preactsService.getAllForms().then((forms) => {
    //            res.send({
    //                forms
    //            })
    //        })
    //    });

    app.get("/preacts/getAllForms/forms/:id", function (req, res) {
        preactsService.getAllFormsViaCurrentCheckerID(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    });

    //ajax request for all the forms owned by a user
    app.get("/preacts/getAllFormsOfUser/:id", function (req, res) {
        preactsService.getAllFormsOfOwner(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms checked by a user with a matching string in activity name
    app.get("/preacts/getAllFormsWithMatchingString/forms/:id/:searchQuery", function (req, res) {
        preactsService.getAllFormsWithStringMatch(req.params.id, req.params.searchQuery).then((forms) => {
            res.send({
                forms
            })
        })
    });

    //ajax request for all the forms owned by a user with a matching string in activity name
    app.get("/preacts/getAllOwnedFormsWithMatchingString/forms/:id/:searchQuery", function (req, res) {
        preactsService.getAllOwnedFormsWithStringMatch(req.params.id, req.params.searchQuery).then((forms) => {
            res.send({
                forms
            })
        })
    });

    //ajax request for all the forms owned by a user, sorted by date of event (ascending)
    app.get("/preacts/sortEventDateAsc/:id", function (req, res) {
        console.log("Test");
        preactsService.sortEventDateAsc(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms owned by a user, sorted by date of event (descending)
    app.get("/preacts/sortEventDateDesc/:id", function (req, res) {
        console.log("Test2");
        preactsService.sortEventDateDesc(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms owned by a user, sorted by date of form submission (ascending)
    app.get("/preacts/sortFormDateAsc/:id", function (req, res) {
        console.log("Test3");
        preactsService.sortFormDateAsc(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms owned by a user, sorted by date of form submission (descending)
    app.get("/preacts/sortFormDateDesc/:id", function (req, res) {
        console.log("Test4");
        preactsService.sortFormDateDesc(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })
    
    //ajax request for all the forms checked by a user, sorted by date of event (ascending)
    app.get("/preacts/sortEventDateAscChecked/:id", function (req, res) {
        console.log("Test");
        preactsService.sortEventDateAscChecked(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms checked by a user, sorted by date of event (descending)
    app.get("/preacts/sortEventDateDescChecked/:id", function (req, res) {
        console.log("Test2");
        preactsService.sortEventDateDescChecked(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms checked by a user, sorted by date of form submission (ascending)
    app.get("/preacts/sortFormDateAscChecked/:id", function (req, res) {
        console.log("Test3");
        preactsService.sortFormDateAscChecked(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms checked by a user, sorted by date of form submission (descending)
    app.get("/preacts/sortFormDateDescChecked/:id", function (req, res) {
        console.log("Test4");
        preactsService.sortFormDateDescChecked(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })
}