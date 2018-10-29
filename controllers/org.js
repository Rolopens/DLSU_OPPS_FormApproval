const path = require("path");

let orgService = require(path.join(__dirname, "..", "models", "orgService"));
let userService = require(path.join(__dirname, "..", "models", "userService.js"));

module.exports.controller = function (app) {

    app.get('/organization', function(req, res) {
        userService.hasOrgManagementRights(req.session.uid)
        .then((result)=>{
          if (!result) throw Error("User does not have org management rights");
          res.render('org-management', {
            preacts : true,
            postacts : true,
            accounts : true,
            organization : true
          });
        })
        .catch((err)=>{
          console.log(err);
          res.redirect("/preacts");
        })
    })

    // adding org
    app.post('/organization', function(req, res) {
        console.log("im here")
        if(req.session.uid == null) {
            return res.redirect('/')
        }

        orgService.userCanCreateOrg(req.session.uid, function(userCheck) {
            if(userCheck.status != 'success') {
                return res.redirect("/organization?error=" + userCheck.data.message)
            }

            if (userCheck.data == undefined) {
                return res.redirect("/organization?error=unauthorized")
            }

            var org_data = {
                name: req.body.name,
                abbrev : req.body.abbrev,
                type : userCheck.data.type,
                enabled : true
            }

            orgService.createOrg(org_data, function(response) {
                if (response.status == 'success')
                    return res.redirect('/organization?message=new')
                res.redirect('/organization?error=' + response.data.message)
            })
        })
    })

    app.put("/organizations", function(req,res){
        if(req.session.uid == null) {
            return res.redirect('/')
        }
        data = req.body
        // use req.body to get passed data;
        orgService.getOrg(data.id, function(result){
            if(result.status && result.data != undefined) {
                orgService.userCanEditOrg(req.session.uid,
                    result.data, function(canEdit, data){
                    console.log(canEdit)
                    if(canEdit){
                        orgService.changeOrgStatus(!data.enabled, data.org_id,function(data){
                            console.log(data)
                        })
                    }
                })
            }
        })
    })

    app.get('/organizations', function(req, res){
        orgService.userCanSeeOrg(req.session.uid, function(userCheck) {
            if(userCheck.status != 'success') {
                return res.redirect("/organization?error=" + userCheck.data.message)
            }

            if (userCheck.data == undefined) {
                return res.redirect("/organization?error=unauthorized")
            }
            if(userCheck.data.type == "SLIFE") {
                orgService.getAllOrgs(function(rows){
                    var toSend=[]
                    if(rows != undefined) {
                        toSend = rows
                    }
                    res.send({orgs: toSend})
                })
            } else {
                console.log(userCheck.data.type)
                orgService.getAllTypeOrgs(userCheck.data.type, function(rows){
                    var toSend=[]
                    if(rows != undefined) {
                        toSend = rows
                    }
                    console.log(toSend)
                    res.send({orgs: toSend})
                })
            }
        })
    })

    app.post('/editOrganization', function(req,res) {

        if(req.session.uid == null) {
            return res.redirect('/')
        }
        data = req.body
        let id = data.id
        let name = data.name
        let abbrev = data.abbrev

        orgService.getOrgName(name,abbrev, function(isDuplicate) {
            if (isDuplicate) {
                return res.send({msg:"duplicate exists"})
            }
            // use req.body to get passed data;
            orgService.getOrg(id, function(result){
                if(result.status && result.data != undefined) {
                    orgService.userCanEditOrg(req.session.uid,
                        result.data, function(canEdit, data){
                        if(canEdit){
                            orgService.changeOrgName(name, abbrev, id,function(data){
                                console.log(data)
                                return res.send({msg:"success"})
                            })
                        } else {
                            return res.send({msg:"unauthorized"})
                        }
                    })
                }
            })
        })

    })
}
