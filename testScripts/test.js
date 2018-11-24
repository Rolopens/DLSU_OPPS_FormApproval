require("./../configuration/database.js")

const userService = require("../models/userService.js")
const roleService = require("../models/roleService.js")
const orgService = require("../models/orgService.js")

var promise1 = new Promise(
  function (resolve, reject) {
    var org, role;
    orgService.createOrg({
      name : "Council of Student Organizations",
      abbrev : "CSO",
      type : "CSO",
      enabled : true
    })
    .then((retOrg)=>{
      org = retOrg;
      return roleService.createRole({
        name : "PRESIDENT"
      });
    })
    .then((retRole)=>{
      role = retRole;
      return userService.createUser({
        email : "abc1@dlsu.edu.ph",
        password : "password",
        firstname : "Juan",
        lastname : "Dela Cruz",
        initialOrgId : org._id,
        initialRoleId : role._id,
        initialEnabled : true,
      })
    })
    .then((retUser)=>{
      resolve(retUser);
    })
    .catch((err)=>{
      reject(err);
    });
  }
);

var promise2 = new Promise(
  function (resolve, reject) {
    var org, role;
    orgService.createOrg({
      name : "University Student Government",
      abbrev : "USG",
      type : "USG",
      enabled : true
    })
    .then((retOrg)=>{
      org = retOrg;
      return roleService.createRole({
        name : "HEAD"
      });
    })
    .then((retRole)=>{
      role = retRole;
      return userService.createUser({
        email : "abc2@dlsu.edu.ph",
        password : "password",
        firstname : "SpongeBob",
        lastname : "SquarePants",
        initialOrgId : org._id,
        initialRoleId : role._id,
        initialEnabled : true,
      })
    })
    .then((retUser)=>{
      resolve(retUser);
    })
    .catch((err)=>{
      reject(err);
    });
  }
);

var promise3 = new Promise(
  function (resolve, reject) {
    var org, role;
    orgService.createOrg({
      name : "Office of Student Leadership Involvement, Formation and Empowerment",
      abbrev : "SLIFE",
      type : "SLIFE",
      enabled : true
    })
    .then((retOrg)=>{
      org = retOrg;
      return roleService.createRole({
        name : "DIRECTOR"
      });
    })
    .then((retRole)=>{
      role = retRole;
      return userService.createUser({
        email : "abc3@dlsu.edu.ph",
        password : "password",
        firstname : "Patrick",
        lastname : "Star",
        initialOrgId : org._id,
        initialRoleId : role._id,
        initialEnabled : true,
      })
    })
    .then((retUser)=>{
      resolve(retUser);
    })
    .catch((err)=>{
      reject(err);
    });
  }
);

var promise4 = new Promise(
  function (resolve, reject) {
    var org1, role1, org2, org3;
    orgService.createOrg({
      name : "Gakuen Anime Shoshiki",
      abbrev : "GAS",
      type : "CSO",
      enabled : true
    })
    .then((retOrg1)=>{
      org1 = retOrg1;
      return roleService.createRole({
        name : "PROJECT_HEAD"
      });
    })
    .then((retRole1)=>{
      role1 = retRole1;
      return orgService.createOrg({
        name : "La Salle Computer Society",
        abbrev : "LSCS",
        type : "CSO",
        enabled : true
      });
    })
    .then((retOrg2)=>{
      org2 = retOrg2;
      return userService.createUser({
        email : "abc4@dlsu.edu.ph",
        password : "password",
        firstname : "Eugene",
        lastname : "Krabs",
        initialOrgId : org1._id,
        initialRoleId : role1._id,
        initialEnabled : true,
      })
    })
    .then((retUser)=>{
      return userService.addRoleToUser({
        user_id : retUser._id,
        org_id : org2._id,
        role_id : role1._id,
        enabled : true
      });
    })
    .then((retUser)=>{
      return orgService.createOrg({
        name : "CATCH2T20",
        abbrev : "CATCH2T20",
        type : "USG",
        enabled : true
      });
    })
    .then((retOrg3)=>{
      org3 = retOrg3;
      return userService.createUser({
        email : "abc5@dlsu.edu.ph",
        password : "password",
        firstname : "Sheldon",
        lastname : "Plankton",
        initialOrgId : org3._id,
        initialRoleId : role1._id,
        initialEnabled : true
      });
    })
    .then((retUser)=>{
      resolve(retUser);
    })
    .catch((err)=>{
      reject(err);
    });
  }
);

Promise.all([promise1, promise2, promise3, promise4])
.then((users)=>{
  console.log(users);
})
.catch((err)=>{
  console.log(err);
})
