const path = require("path");
const duration = require("duration");

const userService = require(path.join(__dirname, "..", "models", "userService.js"));
const roleService = require(path.join(__dirname, "..", "models", "roleService.js"));
const orgService = require(path.join(__dirname, "..", "models", "orgService.js"));
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
                res.render('preacts', {
                    preacts: true,
                    postacts: true,
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
    });

    //ajax request for quick view
    app.get("/preacts/:id", function (req, res) {
        var id = req.params.id

        preactsService.findFormViaId(id).then((form) => {
            res.send({
                form
            })
        })
    })

    //ajax request for all the forms
    app.get("/preacts/getAllForms/forms", function (req, res) {
        preactsService.getAllForms().then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for all the forms owned by a user
    app.get("/preacts/getAllFormsOfUser/:id", function (req, res) {
        preactsService.getAllFormsOfOwner(req.params.id).then((forms) => {
            res.send({
                forms
            })
        })
    })

    //ajax request for approving a form
    app.post("/preacts/approve/:id", function (req, res) {
        var id = req.params.id;
        preactsService.findFormViaId(id).then((formData) => {
            var form = formData;
            form.status = "Approved";
            preactsService.updateForm(form).then((updatedForm) => {
                preactsService.findFormViaId(form._id).then((formData1) => {
                    res.send({
                        formData1
                    })
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
                    res.send({
                        formData1
                    })
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

        //        console.log("FORM CREATION 1")
        //        console.log (req.session.id)
        //        console.log("DEBUG: " + req.session.title);
        //        console.log("DEBUG: " + req.session.nature);
        //        console.log("DEBUG: " + req.session.type);
        //        console.log("DEBUG: " + req.session.startDate);
        //        console.log("DEBUG: " + req.session.startTime);
        //        console.log("DEBUG: " + req.session.endDate);
        //        console.log("DEBUG: " + req.session.endTime);
        //        console.log("DEBUG: " + req.session.venue);
        //        console.log("DEBUG: " + req.session.enmp);
        //        console.log("DEBUG: " + req.session.emp);
        //        console.log("DEBUG: " + req.session.reach);
        //        console.log("DEBUG: " + req.session.online);
        //        console.log("DEBUG: " + req.session.GOSM);
        res.render('form2');

    });

    app.post('/create-form-2-confirm', function (req, res) {
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
            total: parseFloat(req.body.OrganizationalFunds) + parseFloat(req.body.ParticipantsFee) + parseFloat(req.body.OtherFunds)
        }


        //accessing data from project head table
        var pheadData = [];

        var pheadlength = parseInt(req.body.dynamicTable1len, 10) + 1;
        for (var i = 0; i < pheadlength; i++) {
            var rowdata = {
                name: req.body['phead_name' + i],
                contact_number: req.body['phead_number' + i]
            }
            pheadData.push(rowdata);
        }
        req.session.pheadData = pheadData;
        //console.log("PHEAD LENGTH: " + pheadlength)

        //accessing data from comprehensive program design table
        var programData = [];
        var programlength = parseInt(req.body.dynamicTable2len, 10) + 1;
        for (var i = 0; i < programlength; i++) {
            var start = req.body.startTime0.split(":");
            var end = req.body.endTime0.split(":");
            var dur = new duration(new Date(0, 0, 0, start[0], start[1], 0, 0), new Date(0, 0, 0, end[0], end[1], 0, 0));

            var rowdata = {
                startTime: req.body['startTime' + i],
                endTime: req.body['endTime' + i],
                duration: dur.minutes,
                activity: req.body['activity' + i],
                description: req.body['description' + i],
                person: req.body['person' + i]
            }
            programData.push(rowdata);
        }
        req.session.programData = programData;

        //accessing data from breakdown of expenses table
        var expensesData = [];
        var expenseslength = parseInt(req.body.dynamicTable3len, 10) + 1;
        var totalExpenses = 0.00;
        for (var i = 0; i < expenseslength; i++) {
            var rowdata = {
                name: req.body['material' + i],
                quantity: req.body['quantity' + i],
                unit_cost: req.body['unit' + i],
                total_cost: req.body['quantity' + i] * req.body['unit' + i]
            }
            totalExpenses = rowdata.total_cost + totalExpenses;
            expensesData.push(rowdata);
        }
        req.session.breakdownOfExpenses = {
            material: expensesData,
            total_expense: totalExpenses
        }
        //        req.session.boeTotal = req.body.boeTotal;
        req.session.organizational_funds = {
            operational_fund: req.body.OperationalFund,
            depository_fund: req.body.DepositoryFund,
            other_fund: req.body.OtherFund,
            //accumulated_fund: req.body.AccumulatedFund,
            total_disbursement: parseFloat(req.body.OperationalFund) + parseFloat(req.body.DepositoryFund) + parseFloat(req.body.OtherFund),
            projected_expenses: totalExpenses,
            rem_balance: parseFloat(req.body.OperationalFund) + parseFloat(req.body.DepositoryFund) + parseFloat(req.body.OtherFund) - totalExpenses
        }
        //accessing data from projected revenue table
        var projRevData = [];
        var projRevlength = parseInt(req.body.dynamicTable4len, 10) + 1;
        for (var i = 0; i < projRevlength; i++) {
            var rowdata = {
                item: req.body['item' + i],
                quantity: req.body['qty' + i],
                price: req.body['price' + i],
                amount: req.body['qty' + i] * req.body['price' + i]
            }
            projRevData.push(rowdata);
        }
        req.session.projRevData = projRevData;

        //accessing data from projected expenses table
        var projExpData = [];
        var projExplength = parseInt(req.body.dynamicTable5len, 10) + 1;
        for (var i = 0; i < projExplength; i++) {
            var rowdata = {
                item: req.body['it' + i],
                quantity: req.body['qu' + i],
                price: req.body['pr' + i],
                amount: req.body['qu' + i] * req.body['pr' + i]
            }
            projExpData.push(rowdata);
        }
        req.session.porjExpData = projExpData;
        req.session.projIncomeTotal = req.body.projIncomeTotal;
        //        console.log("FROM CREATION PART 2")
        //        console.log(req.session.programData);
        //        console.log(req.session.breakdownOfExpenses);
        //        console.log(req.session.organizational_funds);

        //        console.log("DEBUG: " + req.session.objective1);
        //        console.log("DEBUG: " + req.session.objective2);
        //        console.log("DEBUG: " + req.session.objective3);
        //        console.log("DEBUG: " + req.session.PR.name);
        //        console.log("DEBUG: " + req.session.PR.position);
        //        console.log("DEBUG PHEADATA " + pheadData[0].name);
        var usersOrganization;
        userService.getUserWithId(req.session.uid).then((userObject) => {
            var org_id = userObject.user_roles[0].org_id;
            console.log("LOG: USER OBJECT")
            return orgService.findSpecificOrg(org_id).then((orgObject) => {
                usersOrganization = orgObject.name;
                var form = new Form({
                    "title": req.session.title,
                    "nature": req.session.nature,
                    "typeOfActivity": req.session.type,
                    "enmp": req.session.enmp,
                    "enp": req.session.enp,
                    "startDate": req.session.startDate,
                    "startTime": req.session.startTime,
                    "endDate": req.session.endDate,
                    "endTime": req.session.endTime,
                    "venue": req.session.venue,
                    "reach": req.session.reach,
                    "GOSM": req.session.GOSM,
                    "online": req.session.online,
                    "context": [req.session.context1, req.session.context2, req.session.context3],
                    "objectives": [req.session.objective1, req.session.objective2, req.session.objective3],
                    "person_responsible": req.session.PR,
                    "source_funds": req.session.sourceFunds,
                    "organizational_funds": req.session.organizational_funds,
                    "program_flow": req.session.programData,
                    "projectHeads": req.session.pheadData,
                    "breakdown_expenses": req.session.breakdownOfExpenses,
                    "projected_income": {
                        revenue: req.session.projRevData,
                        expenses: req.session.porjExpData,
                        total: req.session.projIncomeTotal
                    },
                    "comments": null,
                    "position": null,
                    "creationDate": new Date,
                    "org": usersOrganization, //fix this later on
                    "position": "Documents Committee",
                    "status": "Pending",
                    "user_id": req.session.uid
                });
                return preactsService.addForm(form).then((addedForm) => {
                    console.log(addedForm);
                    clearSessionForm(req);
                }).catch((err)=>{
                    console.log("ERROR: Failed to add form in database");
                    console.log(err);
                });



            }).catch((err) => {
                console.log("ERROR: Failed to find organization given org_id - " + org_id);
                console.log(err);
            });
        }).catch((err) => {
            console.log("ERROR: Failed to find user given user_id - " + req.session.uid);
            console.log(err);
        });


        res.redirect('/preacts-submission');
    });

    var clearSessionForm = function (req) {
        req.session.title = null;
        req.session.nature = null;
        req.session.type = null;
        req.session.enmp = null;
        req.session.enp = null;
        req.session.startDate = null;
        req.session.startTime = null;
        req.session.endDate = null;
        req.session.endTime = null;
        req.session.venue = null;
        req.session.reach = null;
        req.session.GOSM = null;
        req.session.online = null;
        req.session.context1 = null;
        req.session.context2 = null;
        req.session.context3 = null;
        req.session.objective1 = null;
        req.session.objective2 = null;
        req.session.objective3 = null;
        req.session.PR = null;
        req.session.sourceFunds = null;
        req.session.organizational_funds = null;
        req.session.programData = null;
        req.session.pheadData = null;
        req.session.breakdownOfExpenses = null;
        req.session.projRevData = null;
        req.session.porjExpData = null;
        req.session.projIncomeTotal = null;
    }
}
