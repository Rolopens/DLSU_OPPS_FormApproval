const path = require("path");
const duration = require("duration");
const fs = require('fs')

const userService = require(path.join(__dirname, "..", "..", "models", "userService.js"));
const roleService = require(path.join(__dirname, "..", "..", "models", "roleService.js"));
const orgService = require(path.join(__dirname, "..", "..", "models", "orgService.js"));
const preactsService = require(path.join(__dirname, "..", "..",  "models", "preactsService.js"));
const processes = require(path.join(__dirname, "..", "..", "configuration", "approvalProcess.json"))
const {
    Form
} = require(path.join(__dirname, "..", "..",  "models", "preactsForm.js"))

module.exports.controller = function (app){
   //ajax request for approving a form
    app.post("/preacts/approve/:id", function (req, res) {
        var id = req.params.id;
        preactsService.findFormViaId(id).then((formData) => {
            var form = formData;
            if (parseInt(form.position, 10) === (Object.keys(processes[form.processType]).length - 1)) {
                form.status = "Approved";
            } else {
                form.status = "Pending"
                var prevPosition = form.position,
                    checked = false;

                for (var key in processes[form.processType]) {
                    if (checked) {
                        form.position = key
                        break;
                    }
                    if (prevPosition == key) {
                        checked = true;
                    }
                }
            }
            var nextRole, nextOrg, role1, org1;

            var temp = processes[form.processType][form.position].split("-", 2);
            nextRole = temp[0];
            nextOrg = temp[1];


            if (nextOrg === 'BATCH') {
                userService.getUserWithId(req.session.uid).then((retUser) => {
                    var curUser = retUser;
                    roleService.getRoleWithName(nextRole).then((retrole) => {
                        role1 = retrole;
                        orgService.getOrgWithAbbrev(form.org).then((retOrg) => {
                            org1 = retOrg;
                            userService.findUserByOrgAndRoleID(org1._id, role1._id).then((users) => {
                                var temp = form.currentCheckers;
                                form.currentCheckers.forEach(function(item){
                                    form.currentViewers.push(item)
                                })
                                if (form.status === "Approved") {
                                    form.currentCheckers = [];
                                } else {
                                    form.currentCheckers = users;
                                }
                                //                            form.currentCheckers = users
                                preactsService.updateForm(form).then((updatedForm) => {
                                    preactsService.findFormViaId(form._id).then((formData1) => {
                                        //                                res.send({
                                        //                                    formData1
                                        //                                })
                                        res.redirect('/preacts')
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                }).catch((err) => {
                                    console.log(err);
                                })
                            })
                        })
                    })
                })
            } else if (nextOrg === 'COLLEGE') {
                var collegeName;
                userService.getUserWithId(req.session.uid).then((retUser) => {
                    var curUser = retUser;
                    roleService.getRoleWithName(nextRole).then((retRole) => {
                        role1 = retRole;
                        orgService.getOrgWithAbbrev(form.org).then((retOrg) => {
                            org1 = retOrg;
                            if (org1.abbrev.includes("BLAZE")) {
                                collegeName = "COB_CG"
                            } else if (org1.abbrev.includes("FAST")) {
                                collegeName = "CLA_CG"
                            } else if (org1.abbrev.includes("ENG")) {
                                collegeName = "COE_CG"
                            } else if (org1.abbrev.includes("CATCH")) {
                                collegeName = "CCS_CG"
                            } else if (org1.abbrev.includes("FOCUS")) {
                                collegeName = "COS_CG"
                            } else if (org1.abbrev.includes("EDGE")) {
                                collegeName = "CED_CG"
                            } else if (org1.abbrev.includes("EXCEL")) {
                                collegeName = "SOE_CG"
                            }
                            orgService.getOrgWithAbbrev(collegeName).then((retOrg) => {
                                org1 = retOrg;
                                userService.findUserByOrgAndRoleID(org1._id, role1._id).then((users) => {
                                    var temp = form.currentCheckers;
                                    form.currentCheckers.forEach(function(item){
                                        form.currentViewers.push(item)
                                    })
                                    if (form.status === "Approved") {
                                        form.currentCheckers = [];
                                    } else {
                                        form.currentCheckers = users;
                                    }
                                    //                            form.currentCheckers = users
                                    preactsService.updateForm(form).then((updatedForm) => {
                                        preactsService.findFormViaId(form._id).then((formData1) => {
                                            //                                res.send({
                                            //                                    formData1
                                            //                                })
                                            res.redirect('/preacts')
                                        }).catch((err) => {
                                            console.log(err)
                                        })
                                    }).catch((err) => {
                                        console.log(err);
                                    })
                                })
                            })
                        })
                    })
                })
            } else if (nextOrg === 'ORG') {
                roleService.getRoleWithName(nextRole).then((retRole) => {
                    role1 = retRole
                    orgService.getOrgWithName(form.org).then((retOrg) => {
                        org1 = retOrg
                        userService.findUserByOrgAndRoleID(org1._id, role1._id).then((users) => {
                            var temp = form.currentCheckers;
                            form.currentCheckers.forEach(function(item){
                                form.currentViewers.push(item)
                            })
                            if (form.status === "Approved") {
                                form.currentCheckers = [];
                            } else {
                                form.currentCheckers = users;
                            }
                            //                            form.currentCheckers = users
                            preactsService.updateForm(form).then((updatedForm) => {
                                preactsService.findFormViaId(form._id).then((formData1) => {
                                    //                                res.send({
                                    //                                    formData1
                                    //                                })
                                    res.redirect('/preacts')
                                }).catch((err) => {
                                    console.log(err)
                                })
                            }).catch((err) => {
                                console.log(err);
                            })
                        })
                    })
                })
            } else {
                roleService.getRoleWithName(nextRole).then((retRole) => {
                    role1 = retRole
                    orgService.getOrgWithAbbrev(nextOrg).then((retOrg) => {
                        org1 = retOrg
                        userService.findUserByOrgAndRoleID(org1._id, role1._id).then((users) => {
                            var temp = form.currentCheckers;
                            form.currentCheckers.forEach(function(item){
                                form.currentViewers.push(item)
                            })
                            if (form.status === "Approved") {
                                form.currentCheckers = [];
                            } else {
                                form.currentCheckers = users;
                            }
                            //                            form.currentCheckers = users
                            preactsService.updateForm(form).then((updatedForm) => {
                                preactsService.findFormViaId(form._id).then((formData1) => {
                                    //                                res.send({
                                    //                                    formData1
                                    //                                })
                                    res.redirect('/preacts')
                                }).catch((err) => {
                                    console.log(err)
                                })
                            }).catch((err) => {
                                console.log(err);
                            })
                        })
                    })
                })
            }

        })
    }) 
}