const path = require("path");
const duration = require("duration");
const fs = require('fs')

const userService = require(path.join(__dirname, "..", "..", "models", "userService.js"));
const roleService = require(path.join(__dirname, "..", "..", "models", "roleService.js"));
const orgService = require(path.join(__dirname, "..",  "..", "models", "orgService.js"));
const preactsService = require(path.join(__dirname, "..", "..", "models", "preactsService.js"));
const processes = require(path.join(__dirname, "..", "..", "configuration", "approvalProcess.json"))
const {
    Form
} = require(path.join(__dirname, "..", "..", "models", "preactsForm.js"))

module.exports.controller = function (app){
    //ajax request for rejecting a form
    app.post("/preacts/reject/:id", function (req, res) {
        var id = req.params.id
        preactsService.findFormViaId(id).then((formData) => {
            var form = formData
            form.status = "Rejected"
            form.comments = req.body.comments;
            form.currentCheckers.forEach(function(item){
                form.currentViewers.push(item)
            })
            form.currentCheckers = []

            preactsService.updateForm(form).then((updatedForm) => {
                preactsService.findFormViaId(form._id).then((formData1) => {
                    res.redirect('/preacts')
                })
            })
        })
    })

    app.post("/preacts/fullReject/:id", function (req, res) {
        var id = req.params.id
        preactsService.findFormViaId(id).then((formData) => {
            var form = formData
            form.status = "Fully Rejected"
            form.comments = req.body.comments;
            form.currentCheckers = []
            form.currentCheckers.forEach(function(item){
                form.currentViewers.push(item)
            })
            preactsService.updateForm(form).then((updatedForm) => {
                preactsService.findFormViaId(form._id).then((formData1) => {
                    res.redirect('/preacts')
                })
            })
        })
    })
    app.post("/preacts/commentreject/:id/:comment", function (req, res) {
        var id = req.params.id
        preactsService.findFormViaId(id).then((formData) => {
            var form = formData
            form.status = "Rejected"
            form.comments = req.params.comment;
            form.currentCheckers.forEach(function(item){
                form.currentViewers.push(item)
            })
            form.currentCheckers = []

            preactsService.updateForm(form).then((updatedForm) => {
                preactsService.findFormViaId(form._id).then((formData1) => {
                    res.redirect('/preacts')
                })
            })
        })
    })

    app.post("/preacts/commentfullReject/:id/:comment", function (req, res) {
        var id = req.params.id
        preactsService.findFormViaId(id).then((formData) => {
            var form = formData
            form.status = "Fully Rejected"
            form.comments = req.params.comment;
            form.currentCheckers = []
            form.currentCheckers.forEach(function(item){
                form.currentViewers.push(item)
            })
            preactsService.updateForm(form).then((updatedForm) => {
                preactsService.findFormViaId(form._id).then((formData1) => {
                    res.redirect('/preacts')
                })
            })
        })
    })



}