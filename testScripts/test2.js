require("./../configuration/database.js")

const userService = require("../models/userService.js")
const roleService = require("../models/roleService.js")
const orgService = require("../models/orgService.js")


//people for GOVERNMENT_PROCESS-USG-SLIFE
//"GOVERNMENT_PROCESS-USG-SLIFE" : [
//        "CHECKER-OPLOG",
//        "CHECKER-ORTEAS",
//        "PRESIDENT-USG",
//        "PRESIDENT-DLSU",
//        "APPROVER-SLIFE"
//    ],
//Always remember <ROLE>-<ORG>

var promise1 = new Promise(
    function (resolve, reject) {
        var org1, role1, org2, org3;
        orgService.createOrg({
                name: "Office of Operations and Logistics",
                abbrev: "OPLOG",
                type: "USG",
                enabled: true
            })
            .then((retOrg1) => {
                org1 = retOrg1;
                return roleService.createRole({
                    name: "CHECKER"
                });
            })
            .then((retRole1) => {
                role1 = retRole1;
                return userService.createUser({
                    email: "OPLOG_CHECKER@dlsu.edu.ph",
                    password: "password",
                    firstname: "Romeo",
                    lastname: "Narvasa",
                    initialOrgId: org1._id,
                    initialRoleId: role1._id,
                    initialEnabled: true,
                })
            })
            .then((retUser) => {
                return orgService.createOrg({
                    name: "Office of the Treasurer",
                    abbrev: "OTREAS",
                    type: "USG",
                    enabled: true
                });
            })
            .then((retOrg3) => {
                org3 = retOrg3;
                return userService.createUser({
                    email: "OTREAS_CHECKER@dlsu.edu.ph",
                    password: "password",
                    firstname: "Romeo",
                    lastname: "Manuel",
                    initialOrgId: org3._id,
                    initialRoleId: role1._id,
                    initialEnabled: true,
                });
            })
            .then((retUser) => {
                resolve(retUser);
            })
            .catch((err) => {
                reject(err);
            });
    }
);

var promise2 = new Promise(
    function (resolve, reject) {
        var org1, role1, org2, org3, org4, org5;
        orgService.createOrg({
                name: "University Student Government",
                abbrev: "USG",
                type: "USG",
                enabled: true
            })
            .then((retOrg1) => {
                org1 = retOrg1;
                return roleService.createRole({
                    name: "PRESIDENT"
                });
            })
            .then((retRole1) => {
                role1 = retRole1;
                return userService.createUser({
                    email: "USG_PRESIDENT@dlsu.edu.ph",
                    password: "password",
                    firstname: "Romeo",
                    lastname: "Pena",
                    initialOrgId: org1._id,
                    initialRoleId: role1._id,
                    initialEnabled: true,
                })
            })
            .then((retUser) => {
                return orgService.createOrg({
                    name: "De La Salle University",
                    abbrev: "DLSU",
                    type: "USG",
                    enabled: true
                });
            })
            .then((retOrg3) => {
                org3 = retOrg3;
                return userService.createUser({
                    email: "DLSU_PRESIDENT3@dlsu.edu.ph",
                    password: "password",
                    firstname: "Romeo",
                    lastname: "Pedro",
                    initialOrgId: org3._id,
                    initialRoleId: role1._id,
                    initialEnabled: true,
                });
            })
            .then((retUser)=>{
                return orgService.createOrg({
                    name: "CATCH2T20",
                    abbrev: "CATCH2T20",
                    type: "USG",
                    enabled: true
                });
            })
            .then((retOrg4) => {
                org4 = retOrg4;
                var og1, re1, og2, og3;
                return orgService.createOrg({
                        name: "Gakuen Anime Shoshiki",
                        abbrev: "GAS",
                        type: "CSO",
                        enabled: true
                    })
                    .then((retOrg1) => {
                        og1 = retOrg1;
                        return roleService.createRole({
                            name: "PROJECT_HEAD"
                        });
                    })
                    .then((retRole1) => {
                        re1 = retRole1;
                        return orgService.createOrg({
                            name: "La Salle Computer Society",
                            abbrev: "LSCS",
                            type: "CSO",
                            enabled: true
                        });
                    })
                    .then((retOrg2) => {
                        og2 = retOrg2;
                        return userService.createUser({
                            email: "PHEAD_GAS@dlsu.edu.ph",
                            password: "password",
                            firstname: "Eugene",
                            lastname: "Krabs",
                            initialOrgId: og1._id,
                            initialRoleId: re1._id,
                            initialEnabled: true,
                        })
                    })
                    .then((retUser) => {
                        return userService.addRoleToUser({
                            user_id: retUser._id,
                            org_id: og2._id,
                            role_id: re1._id,
                            enabled: true
                        });
                    })
//                    .then((retUser) => {
//                        return orgService.createOrg({
//                            name: "CATCH2T20",
//                            abbrev: "CATCH2T20",
//                            type: "USG",
//                            enabled: true
//                        });
//                    })
                    .then((retOrg3) => {
                        og3 = retOrg3;
                        return userService.createUser({
                            email: "PHEAD_CATCH@dlsu.edu.ph",
                            password: "password",
                            firstname: "Sheldon",
                            lastname: "Plankton",
                            initialOrgId: org4._id,
                            initialRoleId: re1._id,
                            initialEnabled: true
                        });
                    })
                    .then((retUser)=>{
                       return userService.createUser({
                            email: "catch_president@dlsu.edu.ph",
                            password: "password",
                            firstname: "Ian",
                            lastname: "Ona",
                            initialOrgId: org4._id,
                            initialRoleId: role1._id,
                            initialEnabled: true,
                        });    
                    })
                    .then((retUser) => {
                        resolve(retUser);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .then((retUser)=>{
                return orgService.createOrg({
                    name: "CCS College Government",
                    abbrev: "CCS_CG",
                    type: "USG",
                    enabled: true
                });
            })
            .then((retOrg5) => {
                org5 = retOrg5;
                return userService.createUser({
                    email: "ccs_president@dlsu.edu.ph",
                    password: "password",
                    firstname: "Nicole",
                    lastname: "Domingo",
                    initialOrgId: org5._id,
                    initialRoleId: role1._id,
                    initialEnabled: true,
                });
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    }
);


var promise3 = new Promise(
    function (resolve, reject) {
        var org, role;
        orgService.createOrg({
                name: "Office of Student Leadership Involvement, Formation and Empowerment",
                abbrev: "SLIFE",
                type: "SLIFE",
                enabled: true
            })
            .then((retOrg) => {
                org = retOrg;
                return roleService.createRole({
                    name: "APPROVER"
                });
            })
            .then((retRole) => {
                role = retRole;
                return userService.createUser({
                    email: "SLIFE_APPROVER@dlsu.edu.ph",
                    password: "password",
                    firstname: "Romeo",
                    lastname: "Kalalo",
                    initialOrgId: org._id,
                    initialRoleId: role._id,
                    initialEnabled: true,
                })
            })
            .then((retUser) => {
                resolve(retUser);
            })
            .catch((err) => {
                reject(err);
            });
    }
);

//var promise4 = new Promise(
//    function (resolve, reject) {
//        var org1, role1, org2, org3;
//        orgService.createOrg({
//                name: "Gakuen Anime Shoshiki",
//                abbrev: "GAS",
//                type: "CSO",
//                enabled: true
//            })
//            .then((retOrg1) => {
//                org1 = retOrg1;
//                return roleService.createRole({
//                    name: "PROJECT_HEAD"
//                });
//            })
//            .then((retRole1) => {
//                role1 = retRole1;
//                return orgService.createOrg({
//                    name: "La Salle Computer Society",
//                    abbrev: "LSCS",
//                    type: "CSO",
//                    enabled: true
//                });
//            })
//            .then((retOrg2) => {
//                org2 = retOrg2;
//                return userService.createUser({
//                    email: "PHEAD_GAS@dlsu.edu.ph",
//                    password: "password",
//                    firstname: "Eugene",
//                    lastname: "Krabs",
//                    initialOrgId: org1._id,
//                    initialRoleId: role1._id,
//                    initialEnabled: true,
//                })
//            })
//            .then((retUser) => {
//                return userService.addRoleToUser({
//                    user_id: retUser._id,
//                    org_id: org2._id,
//                    role_id: role1._id,
//                    enabled: true
//                });
//            })
//            .then((retUser) => {
//                return orgService.createOrg({
//                    name: "CATCH2T20",
//                    abbrev: "CATCH2T20",
//                    type: "USG",
//                    enabled: true
//                });
//            })
//            .then((retOrg3) => {
//                org3 = retOrg3;
//                return userService.createUser({
//                    email: "PHEAD_CATCH@dlsu.edu.ph",
//                    password: "password",
//                    firstname: "Sheldon",
//                    lastname: "Plankton",
//                    initialOrgId: org3._id,
//                    initialRoleId: role1._id,
//                    initialEnabled: true
//                });
//            })
//            .then((retUser) => {
//                resolve(retUser);
//            })
//            .catch((err) => {
//                reject(err);
//            });
//    }
//);

var promise5 = new Promise(
    function (resolve, reject) {
        var org, role;
        orgService.createOrg({
                name: "DAAM",
                abbrev: "DAAM",
                type: "USG",
                enabled: true
            })
            .then((retOrg) => {
                org = retOrg;
                return roleService.createRole({
                    name: "APS"
                });
            })
            .then((retRole) => {
                role = retRole;
                return userService.createUser({
                    email: "DAAM_APS@dlsu.edu.ph",
                    password: "password",
                    firstname: "Shan",
                    lastname: "Lee Kim",
                    initialOrgId: org._id,
                    initialRoleId: role._id,
                    initialEnabled: true,
                })
            })
            .then((retUser) => {
                resolve(retUser);
            })
            .catch((err) => {
                reject(err);
            });
    }
);
