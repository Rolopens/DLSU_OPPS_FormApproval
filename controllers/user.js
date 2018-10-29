const path = require("path");

let orgService = require(path.join(__dirname, "..", "models", "orgService.js"));
let userService = require(path.join(__dirname, "..", "models", "userService.js"));
let roleService = require(path.join(__dirname, "..", "models", "roleService.js")); //added

module.exports.controller = function (app) {
    app.get('/accounts', function(req, res) {
      userService.hasUserManagementRights(req.session.uid)
      .then((result)=>{
        if (!result) throw Error("User does not have user management rights");
        res.render('user-management', {
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

    /*
    app.post('/accounts', function(req, res) {
        var data = JSON.parse(req.body.data)
        if(req.session.uid == null) {
            return res.redirect('/')
        }
        console.log("role:"+values.role[data.role_id-1].role_name)
        console.log("org:"+values.organization[data.org_id-1].abbrev)
        if(data.password !== data.cpassword)
                return res.send({error:"passwords do not match"})
        orgRoleService.roleOrgExists(data.role_id, data.org_id, function(exists) {
            console.log(exists)
            userService.userCanCreateUser(req.session.uid,
                values.role[data.role_id-1].role_name,
                values.organization[data.org_id-1].type, exists,
                function(userCheck) {
                    console.log(userCheck)
                if(userCheck.status != 'success') {
                    return res.send({error:"error"})
                }
                if (userCheck.data == undefined || !userCheck.data) {
                    return res.send({error:"unauthorized"})
                }

                createUser(data,res)
            })

        })

    })
    */

    /*
    function createUser(data,res) {
        var user_data = {
            email: data.email,
            password : data.password
        }
        var org_role = {
            org_id: data.org_id,
            role_id: data.role_id,
            enabled: data.status
        }
        userService.getUserByEmail(data.email, function(row) {
            if(!row.status) {
                userService.createUser(user_data, function(response) {
                    if (response.status === 'success') {
                        org_role['user_id'] = response.data
                        userService.createOrgRole(org_role, function(resp) {
                            console.log(resp)
                            if (resp.status === 'success')
                                return res.send({data:'success'})
                        })
                    } else return res.send({error:'error'})
                })
            } else {
                org_role['user_id'] = row.data.user_id
                userService.createOrgRole(org_role, function(resp) {
                    console.log(resp)
                    if (resp.status === 'success')
                        return res.send({data:'success'})
                    else return res.send({error:'error'})
                })
            }

        })

    }
    */

    app.get('/users', function(req, res) {
        userService.getAllExpandedUsers().then((result)=>{
            res.send({users: result})
        }).catch((err)=>{
            console.log(err);
            res.send({users: []});
        })
    })

    app.get('/users/id/:id', (req, res)=>{
        userService.getExpandedUserWithId(req.params.id)
        .then((result)=>{
            res.send({user: result});
        })
        .catch((err)=>{
            console.log(err);
            res.send({user: null});
        })
    });

    app.get('/users/orgtype/:orgtype', (req, res)=>{
      userService.getExpandedUsersWithOrgType(req.params.orgtype)
      .then((users)=>{
        res.send({users});
      })
      .catch((err)=>{
        console.log(err);
        res.send({users: null});
      })
    })

    // sends data for currently logged-in user
    app.get('/whoami', (req, res)=>{
      userService.getExpandedUserWithId(req.session.uid)
      .then((user)=>{
        res.send({user});
      })
      .catch((err)=>{
        console.log(err);
        res.send({user: null});
      })
    })

    app.get('/roles', function(req, res) {
        roleService.getAllRoles().then((result)=>{
            res.send({roles: result})
        }).catch((err)=>{
            console.log(err);
        })
    })

    app.get('/orgs', function(req, res) {
      orgService.getAllOrgs().then((orgs)=>{
        res.send({orgs});
      }).catch((err)=>{
        console.log(err);
      })
    })

    /*app.put("/accounts", function(req,res){
        if(req.session.uid == null) {
            return res.redirect('/')
        }
        data = req.body
        // use req.body to get passed data;
        userService.getUserByEmail(data.email, function(result){
            if(result.status && result.data != undefined) {
                userService.userCanCreateUser(req.session.uid,
                    values.role[data.role_id-1].role_name,
                    values.organization[data.org_id-1].type, false,
                    function(userCheck) {
                        console.log(userCheck)
                    if(userCheck.status != 'success') {
                        return res.send({error:"error"})
                    }
                    if (userCheck.data == undefined || !userCheck.data) {
                        return res.send({error:"unauthorized"})
                    }
                    userService.changeUserStatus(!result.data.enabled, result.data.user_id,
                        result.data.org_id,result.data.role_id,function(data){
                        console.log(data)
                    })
                })
            }
        })
    })*/
}
