const path = require("path");

const Role = require(path.join(__dirname, "Role.js")).Role;

function getAllRoles(){
    return new Promise(
        function(resolve, reject){
            Role.find({}).then((doc) => {
                if (doc) resolve(doc);
                else reject(Error("No roles exist"));
            }, (err)=>{
                reject(err);
            });
        }
    );
}

function getRoleWithId(id){
    return new Promise(
        function(resolve, reject){
            Role.findById(id).then((doc) => {
                if(doc) resolve(doc);
                else reject(Error("Role does not exist"));
            }, (err) => {
                reject(err);
            });
        }
    );
}

function roleExists(id){
  return new Promise(
      function(resolve, reject){
          Role.findById(id).then((doc) => {
              if(doc) resolve(true);
              else resolve(false);
          }, (err) => {
              reject(err);
          });
      }
  );
}

function createRole(data){
  return new Promise(
    function (resolve, reject){
      var name = data.name;

      var r = new Role({name});
      r.save()
      .then((doc)=>{
        resolve(doc)
      })
      .catch((err)=>{
        reject(err)
      });
    }
  );
}

function getRoleWithName(name){
  return new Promise(
    function (resolve, reject){
      Role.findOne({name})
      .then((role)=>{
        if (role) resolve(role);
        else reject(Error("Role does not exist"));
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

module.exports = {getAllRoles, getRoleWithId,
  roleExists, createRole, getRoleWithName};
