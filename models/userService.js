const path = require("path");

const User = require(path.join(__dirname, "User.js")).User;
const orgService = require(path.join(__dirname, "orgService.js"));
const roleService = require(path.join(__dirname, "roleService.js"));
const rights = require(path.join(__dirname, "..", "configuration", "creationRights.json"));

function getUserWithId(_id){
  return new Promise(
    function (resolve, reject){
      User.findById(_id, "email firstname lastname user_roles").then((doc)=>{
        if (doc) resolve(doc);
        else reject(Error("User not found"));
      }, (err)=>{
        reject(err);
      });
    }
  );
}

function getAllUsers(){
  return new Promise(
    function (resolve, reject){
      User.find({}, "email firstname lastname user_roles")
      .then((docs)=>{
        if (docs) resolve(docs);
        else reject(Error("No users"));
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

//String orgType, all caps
function getUsersWithOrgType(orgType){
  return new Promise(
    function (resolve, reject){
      orgService.getOrgsWithOrgType(orgType)
      .then((orgs)=>{
        var orgIds = orgs.map(x => x._id);
        var userPromises = [];
        return User.find({user_roles : {$elemMatch : {org_id : {$in : orgIds}}}}, "email firstname lastname user_roles");
      })
      .then((users)=>{
        if (users) resolve(users);
        else reject(Error("No users with org type " + orgType));
      })
      .catch((err)=>{
        reject(err);
      });
    }
  )
}

function createUser(data){
  return new Promise(
    function (resolve, reject){
      var email = data.email;
      var password = data.password;
      var firstname = data.firstname;
      var lastname = data.lastname;
      var initialOrgId = data.initialOrgId;
      var initialRoleId = data.initialRoleId;
      var initialEnabled = data.initialEnabled;

      orgService.orgExists(initialOrgId)
      .then((result)=>{
        if (!result) reject(Error("Invalid org"));
        else return roleService.roleExists(initialRoleId);
      })
      .then((result)=>{
        if (!result) reject(Error("Invalid role"));
      });

      var u = new User({email, password, firstname, lastname});
      u.save()
      .then((doc)=>{
        var user_role = {
          org_id : initialOrgId,
          role_id : initialRoleId,
          enabled : initialEnabled,
        };
        return User.findByIdAndUpdate(doc._id, {$push : {user_roles : user_role}});
      })
      .then((doc)=>{
        resolve(doc);
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

/*
function userCanCreateUser(_id, role, org){
  return new Promise(
    function (resolve, reject){
      getUserWithId(_id).then((doc)=>{

      }, (err)=>{

      })
    }
  };
}

function userCanEditUser(){

}
*/

module.exports = {getUserWithId, getAllUsers, createUser, getUsersWithOrgType};
