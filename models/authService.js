
let database = require('./../configuration/database')
let logger = require("./logService")

let INSERT_USER_QUERY = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)"
let LOGIN_USER_QUERY = "SELECT * FROM users WHERE email = ? AND password = ?"

module.exports.checkUser = function (email, password, next) {
	let db = database.getDBInstance() 
	
	db.all(LOGIN_USER_QUERY, [email, password], function(error, rows) {
		if (rows.length == 0) {
			logger.logToFile("Error ", "Bad credentials")
			return next({status: 'error', data: {'message': 'BadCredentials'}})
		}

		if (error) {
			logger.logToFile("Error ", error)
			return next({status: 'error', data: error})
		}
		logger.logToFile("Info", "Succesful Login")
		return next({status: 'success', data: rows[0]})
	})


	db.close()
}

module.exports.register = function (user, next) {
	let db = database.getDBInstance() 

	db.run(INSERT_USER_QUERY, [user.email, user.username, user.password], function(error) {
		if (error) {
			logger.logToFile("Error ", "Registration Failure\n" + error)
			return next({status: 'error', data: error})
		}
		logger.logToFile("Info", "Succesful Registration")
		next({status: 'success', data: this.lastID})
	})

	db.close()
}