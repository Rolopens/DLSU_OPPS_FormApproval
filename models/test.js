require("./../configuration/database.js")

const userService = require("./userService.js")
const roleService = require("./roleService.js")
const orgService = require("./orgService.js")

var org, role

orgService.createOrg({
  name : "SLIFE",
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
    email : "abc@dlsu.edu.ph",
    password : "password",
    firstname : "Juan",
    lastname : "Dela Cruz",
    initialOrgId : org._id,
    initialRoleId : role._id,
    initialEnabled : true,
  })
})
.then((retUser)=>{
  console.log(retUser)
})
.catch((err)=>{
  console.log(err)
})
.then(()=>{
  return userService.getUsersWithOrgType("SLIFE");
})
.then((users)=>{
  console.log(users);
})

/*var userData = {
  email : "abc@dlsu.edu.ph",
  password : "hello",
  firstname : "Firstname",
  lastname : "Lastname",
}*/
