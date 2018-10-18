const path = require("path");
const bcrypt = require("bcryptjs");

const User = require(path.join(__dirname, "User.js")).User;

function checkUser(email, password) {
  return new Promise(
    function (resolve, reject) {
      var user;
      User.findOne({email}, "password")
      .then((doc)=>{
        user = doc;
        return bcrypt.compare(password, doc.password);
      })
      .then((res)=>{
        if (res) resolve(user);
        else reject(Error("Invalid credentials"));
      })
      .catch((err)=>{
        reject(err);
      })
    }
  );
}

module.exports = {checkUser};
