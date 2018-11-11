const path = require("path");

const authService = require(path.join(__dirname, "..", "models", "authService.js"));
const roleService = require(path.join(__dirname, "..", "models", "roleService.js"));
const userService = require(path.join(__dirname, "..", "models", "userService.js"));

module.exports.controller = function (app) {

    app.get('/login', function(req, res) {
        if (!req.session.uid) res.redirect("/");
        else res.redirect("/preacts");
    })

    app.post('/login', function(req, res) {
        if(req.session.uid != null) {
            return res.redirect('/')
        }

        var email = req.body.email;
        var password = req.body.password;

        if (email == "" || email == undefined || password == "" || password == undefined)
            return res.redirect("/login?error=badCredentials")
        else {
            authService.checkUser(email, password).then((result)=>{
                req.session.uid = result._id;
                //console.log(req.session.uid);
                return res.redirect('/home');
            }).catch((err)=>{
                return res.redirect("/login?error=BadCredentials");
            })
        }
    })
    
    app.get('/home', (req, res)=>{
        // check if the logged in user is a phead or a checker
        // if phead
            // res.redirect('/preacts-submission')
        // else
            //return res.redirect('/preacts');
        var userId = req.session.uid;
        userService.getUserWithId(userId).then((retUser)=>{
            var roleId = retUser.user_roles[0].role_id; //FIX THIS LATER ON DEPENDING ON HOW MANY ORGS THEY HAVE
            roleService.getRoleWithId(roleId).then((retRole)=>{
                if(retRole.name == "PROJECT_HEAD"){
                    return res.redirect('/preacts-submission');
                } else {
                    return res.redirect('/preacts');
                }
            }).catch((err)=>{
                console.log("ERROR MESSAGE: Cannot find role with id "+roleId);
                console.log(err);
            });
        }).catch((err)=>{
            console.log("ERROR MESSAGE: Cannot find user with id "+ userId);
            console.log(err); 
        });
     });

    /* DEBUG */
    app.get('/auth', function(req, res) {
        console.log(req.session.uid)
        res.send({
            user_id: req.session.uid
        })
    })

    app.get('/logout', function(req, res) {
        req.session.destroy()
        res.redirect('/login')
    })

    app.get('/register', function(req, res) {
        res.render('register')
    })

    app.post('/register', function(req, res) {
        let userDetails = req.body

        authService.register(userDetails, (response) => {
            if (response.status == 'success') {
                return res.redirect('/login?message=new')
            }

            res.redirect('/login?error=' + response.data.message)
        })
    })
}
