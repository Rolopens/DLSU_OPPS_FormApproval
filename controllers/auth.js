let authService = require('./../models/authService')

module.exports.controller = function (app) {

    app.get('/login', function(req, res) {
        res.render('index')
    })

    app.post('/login', function(req, res) {
        if(req.session.uid != null) { 
            return res.redirect('/')
        }

        var email = req.body.email; 
        var password = req.body.password

        if (email == "" || email == undefined || password == "" || password == undefined)
            return res.redirect("/login?error=badCredentials")
        else {        
            authService.checkUser(email, password, function(loginDetails) {   
                if(loginDetails.status != 'success') { 
                    return res.redirect("/login?error=" + loginDetails.data.message)
                }

                req.session.uid = loginDetails.data.user_id
                console.log(req.session.uid)
                return res.redirect('/preacts')
            });
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
        req.session.uid = null
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