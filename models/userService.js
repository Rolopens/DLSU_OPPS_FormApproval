const path = require("path");

const User = require(path.join(__dirname, "User.js")).User;
const orgService = require(path.join(__dirname, "orgService.js"));
const roleService = require(path.join(__dirname, "roleService.js"));
const rights = require(path.join(__dirname, "..", "configuration", "creationRights.json"));

// returns the user document as is (without password)
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

/* returns an "expanded" user object (user_roles replaced with array of
    full org-role details (name, etc.)
*/
function getExpandedUserWithId(_id) {
  return new Promise(
    function(resolve, reject) {
      var finalUser;
      User.findById(_id, "email firstname lastname user_roles")
      .then((user)=>{
        if (!user) throw Error("User not found");

        finalUser = user.toObject();
        var user_roles = user.user_roles;

        var promises = user_roles.map((user_role)=>{
          return new Promise(
            function(resolve, reject){
              return orgService.findSpecificOrg(user_role.org_id)
              .then((org)=>{
                roleService.getRoleWithId(user_role.role_id)
                .then((role)=>{
                  resolve({org : org, role : role, enabled : user_role.enabled});
                })
                .catch((err)=>{reject(err);});
              })
              .catch((err)=>{reject(err);});
            }
          );
        })

        return Promise.all(promises);
      })
      .then((orgRoles)=>{
        finalUser.user_roles = orgRoles;
        resolve(finalUser);
      })
      .catch((err)=>{
        reject(err);
      })
    }
  );
}

function getAllUsers(){
  return new Promise(
    function (resolve, reject){
      User.find({}, "email firstname lastname user_roles", {sort : {email : 1}})
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

function getAllExpandedUsers(){
  return new Promise(
    function (resolve, reject){
      User.find({}, "email firstname lastname user_roles", {sort : {email : 1}})
      .then((users)=>{
        if (!users) reject(Error("No users"));

        var promises = users.map((user)=>{
          return getExpandedUserWithId(user._id);
        });

        return Promise.all(promises);
      })
      .then((expandedUsers)=>{
        resolve(expandedUsers);
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

// returns array of user documents belonging to given org type
//  String orgType, all caps
function getUsersWithOrgType(orgType){
  return new Promise(
    function (resolve, reject){
      orgService.getOrgsWithOrgType(orgType.toUpperCase())
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

function getExpandedUsersWithOrgType(orgType){
  return new Promise(
    function (resolve, reject){
      getUsersWithOrgType(orgType)
      .then((users)=>{
        if (!users) reject(Error("No users"));

        var promises = users.map((user)=>{
          return getExpandedUserWithId(user._id);
        });

        return Promise.all(promises);
      })
      .then((expandedUsers)=>{
        resolve(expandedUsers);
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
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

// adds an org-role pair to a user's user_roles
function addRoleToUser(data){
  return new Promise(
    function (resolve, reject){
      var user_id = data.user_id;
      var org_id = data.org_id;
      var role_id = data.role_id;
      var enabled = data.enabled;

      orgService.orgExists(org_id)
      .then((result)=>{
        if (!result) reject(Error("Invalid org"));
        else return roleService.roleExists(role_id);
      })
      .then((result)=>{
        if (!result) reject(Error("Invalid role"));
        else return User.findByIdAndUpdate(user_id, {$push : {user_roles : {
          org_id, role_id, enabled
        }}});
      })
      .then((user)=>{
        resolve(user);
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

function hasUserManagementRights(_id){
  return new Promise(
    function (resolve, reject){
      getExpandedUserWithId(_id)
      .then((user)=>{
        for (var i = 0 ; i < user.user_roles.length ; i++) {
          if (user.user_roles[i].role.name === "PRESIDENT" ||
          user.user_roles[i].role.name === "HEAD" ||
          user.user_roles[i].role.name === "DIRECTOR") resolve(true);
        }
        resolve(false);
      })
      .catch((err)=>{
        reject(err);
      })
    }
  );
}

function hasOrgManagementRights(_id){
  return hasUserManagementRights(_id);
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

module.exports = {getUserWithId, getExpandedUserWithId,
  getAllUsers, getAllExpandedUsers, createUser, getUsersWithOrgType,
  getExpandedUsersWithOrgType, addRoleToUser,
  hasUserManagementRights, hasOrgManagementRights};
