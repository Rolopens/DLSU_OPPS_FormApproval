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
        if (!req.session.uid) res.redirect("/");
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
            })
            .catch((err) => {
                console.log(err);
                res.redirect("/");
            });
    });

    //ajax request for quick view
    app.get("/preacts/:id", function (req, res) {
        var id = req.params.id

        preactsService.findFormViaId(id).then((formData) => {
            res.send(formData)
        })
    })

    //ajax request for approving a form
    app.post("/preacts/approve/:id", function (req, res) {
        var id = req.params.id

        preactsService.findFormViaId(id).then((formData) => {
            var form = formData
            form.status = "Approved"
            preactsService.updateForm(form).then((updatedForm) => {
                preactsService.findFormViaId(form._id).then((formData1) => {
                    res.send(formData1)
                })
            })
        })
    })

    //ajax request for rejecting a form
    app.post("/preacts/reject/:id", function (req, res) {
        var id = req.params.id

        preactsService.findFormViaId(id).then((formData) => {
            var form = formData
            form.status = "Rejected"
            preactsService.updateForm(form).then((updatedForm) => {
                preactsService.findFormViaId(form._id).then((formData1) => {
                    res.send(formData1)
                })
            })
        })
    })

    //preacts page for submitters
    app.get('/preacts-submission', function (req, res) {

        res.render('preacts-submit', {
            preacts: true,
            postacts: true,
            accounts: canSee,
            organization: canSee
        });
    });

    //form page 1
    app.get('/create-form', function (req, res) {
        res.render('form1');

    });

    //form page 2
    app.post('/create-form-2', function (req, res) {
        res.render('form2');
        req.session.title = req.body.title;
        req.session.nature = req.body.nature;
        if (req.body.type == 'Others') {
            req.session.type = req.body.typeOthers;
        } else {
            req.session.type = req.body.type;
        }
        req.session.startDate = req.body.startDate;
        req.session.startTime = req.body.startTime;
        req.session.endDate = req.body.endDate;
        req.session.endTime = req.body.endTime;
        req.session.venue = req.body.venue;
        req.session.enmp = req.body.enmp;
        req.session.emp = req.body.emp;
        req.session.reach = req.body.reach;
        if (req.body.online == 'yes') {
            req.session.online = true;
        } else {
            req.session.online = false;
        }
        if (req.body.GOSM == 'yes') {
            req.session.GOSM = true;
        } else {
            req.session.GOSM = false;
        }
        console.log("FORM CREATION")
        console.log("DEBUG: " + req.session.title);
        console.log("DEBUG: " + req.session.nature);
        console.log("DEBUG: " + req.session.type);
        console.log("DEBUG: " + req.session.startDate);
        console.log("DEBUG: " + req.session.startTime);
        console.log("DEBUG: " + req.session.endDate);
        console.log("DEBUG: " + req.session.endTime);
        console.log("DEBUG: " + req.session.venue);
        console.log("DEBUG: " + req.session.enmp);
        console.log("DEBUG: " + req.session.emp);
        console.log("DEBUG: " + req.session.reach);
        console.log("DEBUG: " + req.session.online);
        console.log("DEBUG: " + req.session.GOSM);
    });
    
    app.post('/create-form-2-confirm', function (req, res){
        //we need an ejs that allows them to view the form so they can confirm
        req.session.context1 = req.body.context1;
        req.session.context2 = req.body.context2;
        req.session.context3 = req.body.context3;
        req.session.objective1 = req.body.objective1;
        req.session.objective2 = req.body.objective2;
        req.session.objective3 = req.body.objective3;
        req.session.PR = {
            name: req.body.namePR,
            position: req.body.positionPR
        }
        req.session.sourceFunds = {
            organization_funds: req.body.OrganizationalFunds,
            participants_fee: req.body.ParticipantsFee,
            others: req.body.OtherFunds,
            total: req.body.OrganizationalFunds + req.body.ParticipantsFee + req.body.OtherFunds
        }
        req.session.organizational_funds = {
            operational_fund: req.body.OperationalFund,
            depository_fund: req.body.DepositoryFund,
            other_fund: req.body.OtherFund,
            accumulated_fund: req.body.AccumulatedFund,
            total_disbursement: req.body.OperationalFund + req.body.DepositoryFund + req.body.OtherFund + req.body.AccumulatedFund,
            projected_expenses: req.body.ProjectedExpenses,
            rem_balance: req.body.OperationalFund + req.body.DepositoryFund + req.body.OtherFund + req.body.AccumulatedFund - req.body.ProjectedExpenses
        }
        var pheadData =[];
        
        var pheadlength = req.body.dynamicTable1len + 1;
        for (var i=0; i < pheadlength; i++){
            var rowdata = {
                name: req.body['phead_name'+i],
                contact_number: req.body['phead_number'+i]
            }
            pheadData.push(rowdata);
        }
        
        
        console.log("FROM CREATION PART 2")
        console.log("DEBUG: " + req.session.context1);
        console.log("DEBUG: " + req.session.context2);
        console.log("DEBUG: " + req.session.context3);
        console.log("DEBUG: " + req.session.objective1);
        console.log("DEBUG: " + req.session.objective2);
        console.log("DEBUG: " + req.session.objective3);
        console.log("DEBUG: " + req.session.PR.name);
        console.log("DEBUG: " + req.session.PR.position);
        console.log("DEBUG PHEADATA " + pheadData[0].name);
        
        //temporary
//        res.render('preacts-submit', {
//            preacts: true,
//            postacts: true,
//            accounts: canSee,
//            organization: canSee
//        });
//        //temporary
        res.redirect('/preacts-submission');
    });

    app.post('/preacts-submission', function (req, res) {
        var form = new Form({
            "title": req.body.title,
            "nature": req.body.nature,
            "typeOfActivity": req.body.typeOfActivity,
            "enmp": req.body.enmp,
            "enp": req.body.enp,
            "startDate": new Date(req.body.dateOfActivity),
            "venue": req.body.venue,
            "context": req.body.context,
            "objectives": [req.body.objective1, req.body.objective2, req.body.objective3],
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
