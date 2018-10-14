let express = require('express')
let parser = require('body-parser')
let session = require('express-session')
let http = require('http')
let path = require('path')
var ejs = require('ejs')
let fs = require('fs')
let db = require('./configuration/database')
let values = require('./configuration/config')
let mongoose = require('mongoose');

let app = express()
let appSession = session({
    resave: false,
    saveUninitialized: false,
    secret: values.key
})


app.set('port', process.env.PORT || values.port)
app.set('views', __dirname + values.views)
app.set('view engine', 'ejs')

app.use(appSession)
app.use(parser.json())
app.use(parser.urlencoded({ extended: false }));
app.use(function(request, response, next) {
    response.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})

/* set up static view files */
app.use(express.static(__dirname + values.static))

/* set up controllers */
fs.readdirSync('./controllers').forEach(function(file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file)
      route.controller(app)
  }
})

app.listen(app.get('port'), function(){
    console.log('[' + (new Date()).toLocaleString() + '] ' + 'Server has started')
    console.log('[' + (new Date()).toLocaleString() + '] ' + 'Server running at http://localhost:' + values.port)
})