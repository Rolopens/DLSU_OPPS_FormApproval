const path = require("path");

const userService = require(path.join(__dirname, "..", "models", "userService.js"));
const roleService = require(path.join(__dirname, "..", "models", "roleService.js"));

module.exports.controller = function(app) {
    app.get('/postacts', function(req, res) {
      // context is for which menu items to show
      // modify this depending on which user type
      // is in the session
      var roleID;
      var canSee = false;
      if (!req.session.uid) res.redirect("/");
      userService.getUserWithId(req.session.uid)
      .then((result)=>{
        var rolePromises = [];
        for(var i = 0; i < result.user_roles.length; i++){
            roleID = result.user_roles[i].role_id;
            var p = roleService.getRoleWithId(roleID).then((result)=>{
                if(result.name === "DIRECTOR" || result.name === "HEAD" || result.name === "PRESIDENT")
                    canSee = true;
            });
            rolePromises.push(p);
        }
        return Promise.all(rolePromises);
      })
      .then((result)=>{
        res.render('postacts', {
            preacts : true,
            postacts : true,
            accounts : canSee,
            organization : canSee
        });
      })
      .catch((err)=>{
        console.log(err);
        res.redirect("/");
      })
    });
}
