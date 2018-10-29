const path = require("path");

const authService = require(path.join(__dirname, "..", "models", "authService.js"));

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
                console.log(req.session.uid);
                return res.redirect('/preacts');
            }).catch((err)=>{
                return res.redirect("/login?error=BadCredentials");
            })
        }
    })

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
