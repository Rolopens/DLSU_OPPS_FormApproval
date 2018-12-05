const path = require("path");

const Org = require(path.join(__dirname, "Org.js")).Org;

function findSpecificOrg(id) {
    return new Promise(
        function (resolve, reject) {
            Org.findById(
                id
            ).then((doc) => {
                if (doc) resolve(doc);
                else reject(Error("Org does not exist"));
            }, (err) => {
                reject(err);
            });
        }
    );
}

function orgExists(id){
  return new Promise(
      function (resolve, reject) {
          Org.findById(
              id
          ).then((doc) => {
              if (doc) resolve(true);
              else resolve(false);
          }, (err) => {
              reject(err);
          });
      }
  );
}

function deleteOrg(id) {
    return new Promise(
        function (resolve, reject) {
            Org.findByIdAndRemove(id).then((doc) => {
                if (doc) resolve(doc);
                else reject(Error("Org does not exist"));
            }, (err) => {
                reject(err);
            });
        }
    );
}

function updateOrg(id, updated) {
    return new Promise(
        function (resolve, reject) {
            Org.findByIdAndUpdate(
                id, updated).then((doc) => {
                if (doc) resolve(doc);
                else reject(Error("Org does not exist"));
            }, (err) => {
                reject(err);
            });
        }
    );
}

function createOrg(org) {
    return new Promise(
        function (resolve, reject) {
            var o = new Org(org);
            o.save().then((doc) => {
                if (doc) resolve(doc);
                else reject(new Error("Org does not exist"));
            }, (err) => {
                reject(err);
            });
        }
    );
}

function changeOrgStatus(id) {
    return new Promise(
        function (resolve, reject) {
            Org.findById(id).then((doc) => {
                if (doc) resolve(doc);
                else reject(Error("Org does not exist"));
            }, (err) => {
                reject(err)
            })
        }
    );
}

function deactivateOrg(id) {
    return new Promise(
        function (resolve, reject) {
            Org.findByIdAndUpdate(id, {
                enabled: false
            }).then((doc) => {
                if (doc) resolve(doc);
                else reject(Error("Org does not exist"));
            }, (err) => {
                reject(err);
            });
        }
    );
}

function activateOrg(id) {
    return new Promise(
        function (resolve, reject) {
            Org.findByIdAndUpdate(id, {
                enabled: true
            }).then((doc) => {
                if (doc) resolve(doc);
                else reject(Error("Org does not exist"));
            }, (err) => {
                reject(err);
            });
        }
    );
}

function getOrgsWithOrgType(orgType){
  return new Promise(
    function (resolve, reject){
      Org.find({type : orgType})
      .then((docs)=>{
        resolve(docs);
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

function getAllOrgs(){
  return new Promise(
    function (resolve, reject){
      Org.find({})
      .then((orgs)=>{
        resolve(orgs);
      })
      .catch((err)=>{
        reject(err);
      })
    }
  );
}

function getOrgWithAbbrev(abbrev){
  return new Promise(
    function (resolve, reject){
      Org.findOne({abbrev})
      .then((org)=>{
        if (org) resolve(org);
        else reject(Error(abbrev + " Org does not exist"));
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

function getOrgWithName(name){
    return new Promise(
    function (resolve, reject){
      Org.findOne({name})
      .then((org)=>{
        if (org) resolve(org);
        else reject(Error(abbrev + " Org does not exist"));
      })
      .catch((err)=>{
        reject(err);
      });
    }
  );
}

module.exports = {activateOrg, deactivateOrg, findSpecificOrg, orgExists,
  deleteOrg, updateOrg, createOrg, changeOrgStatus, getOrgsWithOrgType,
  getAllOrgs, getOrgWithAbbrev, getOrgWithName};
