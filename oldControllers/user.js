let orgService = require('./../models/orgService')
let userService = require('./../models/userService')
let orgRoleService = require('./../models/orgRoleService')
let values = require('./../configuration/initialValues')

module.exports.controller = function (app) {
    app.get('/accounts', function(req, res) {
        res.render('user-management')
    })

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

    app.get('/users', function(req, res) {
        userService.userGetAllUsers(function(rows){
            var toSend=[]
            if(rows != undefined) {
                toSend = rows
            }
            res.send({users: toSend})
        })
    })

    app.get('/roles', function(req, res) {
        userService.userGetAllRoles(function(rows){
            var toSend=[]
            if(rows != undefined) {
                toSend = rows
            }
            res.send({roles: toSend})
        })
    })

    app.get('/users/organizations', function(req, res) {
        userService.getUserType(req.session.uid, function(row) {
            //console.log(row.data)
            var toSend=[]
            if(row.status) {
                var orgHead = row.data.filter((x)=>x.role_name == 'ORGUNIT_HEAD')
                var approver = row.data.filter((x)=>x.role_name == 'APPROVER_ADMIN')
                var affil = row.data.filter((x)=>x.role_name == 'AFFILIATION_ADMIN')
                if(orgHead.length != 0)
                    toSend.push(orgHead)
                if(approver.length != 0)
                    toSend.push(approver)
                if(affil != 0) {
                    orgService.getAllTypeOrgs(affil[0].type, function(rows) {
                        toSend.push(rows)
                        return res.send({orgs: toSend})
                    })
                } else res.send({orgs: toSend})
            } 
            
        })
        
    })

    app.put("/accounts", function(req,res){
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
    })
}