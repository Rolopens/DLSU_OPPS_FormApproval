let database = require('./../configuration/database')
let logger = require("./logService")
let rights = require('./../configuration/creationRights')

let GET_USER_QUERY = "SELECT * FROM (((org_role NATURAL JOIN organization) " + 
					   "NATURAL JOIN users) NATURAL JOIN role) " + 
					   "WHERE ((role_name = 'ORGUNIT_HEAD' AND TYPE = 'CSO') " +
					   "OR (role_name = 'ORGUNIT_HEAD' AND TYPE = 'USG') " +
					   "OR (role_name = 'APPROVER_ADMIN' AND  " +
					   "(TYPE = 'APS' OR TYPE = 'ADM' OR TYPE = 'USG' OR TYPE = 'CSO'))) " +
					   "AND user_id = ?"

let GET_USER_ORGS_QUERY = "SELECT org_id, abbrev FROM (((org_role NATURAL JOIN organization) " + 
					"NATURAL JOIN users) NATURAL JOIN role) " + 
					"WHERE ((role_name = 'ORGUNIT_HEAD' AND TYPE = 'CSO') " +
					"OR (role_name = 'ORGUNIT_HEAD' AND TYPE = 'USG') " +
					"OR (role_name = 'APPROVER_ADMIN' AND  " +
					"(TYPE = 'APS' OR TYPE = 'ADM' OR TYPE = 'USG' OR TYPE = 'CSO'))) " +
					"AND user_id = ?"

let GET_ALL_USERS_QUERY = "SELECT * FROM (((org_role NATURAL JOIN organization) " + 
						"NATURAL JOIN users) NATURAL JOIN role) "

let GET_USER_TYPE_QUERY = "SELECT type, abbrev, org_id, role_name FROM (((org_role NATURAL JOIN organization) " + 
						"NATURAL JOIN users) NATURAL JOIN role) WHERE user_id = ?"

let GET_ALL_ROLES_QUERY = "SELECT * FROM role"

let INSERT_USER_QUERY = "INSERT INTO users (email, password) VALUES (?, ?)"	

let INSERT_ORG_ROLE_QUERY = "INSERT INTO org_role (org_id, role_id,user_id,enabled) VALUES (?, ?, ?, ?)"

let GET_USER_EMAIL_QUERY = "SELECT * FROM (((org_role NATURAL JOIN organization) " + 
"NATURAL JOIN users) NATURAL JOIN role) WHERE email = ?"


let UPDATE_USER_QUERY = "UPDATE org_role SET enabled = ? " +
                        "WHERE user_id = ? AND org_id = ? AND role_id = ?"

module.exports.userCanCreateUser = function (uid, role, org, create, next) {
	let db = database.getDBInstance()
	db.all(GET_USER_TYPE_QUERY, [uid], function(error, rows) {
        if (error) {
			logger.logToFile("Error ", error)
			return next({status: 'error', data: error})
		}
        if (rows.length == 0)
            return next({status: 'success', data: undefined})
		var data = rows[0]
		var usertype = data.role_name + "-" + data.type
		console.log(rights[usertype].creatable.includes(role + "-" + org))
		if(rights[usertype] == undefined)
			return next({status: 'success', data: false})
		if (create && rights[usertype].creatable.includes(role + "-" + org))
			return next({status: 'success', data: true})
		else if (!create && (rights[usertype].creatable.includes(role + "-" + org)|| 
			rights[usertype].editable.includes(role + "-" + org)))
			return next({status: 'success', data: true})
		return next({status: 'success', data: false})
    })
}

module.exports.userGetAllUsers = function(next) {
	let db = database.getDBInstance()
	db.all(GET_ALL_USERS_QUERY, function(error, rows) {
		if (error) {
			logger.logToFile("Error ", error)
			return next(undefined)
		}
        if (rows.length == 0)
			return next(undefined)
		return next(rows)
	})
}

module.exports.getUserType = function(id, next) {
	let db = database.getDBInstance()
	db.all(GET_USER_TYPE_QUERY, [id], function(error, rows) {
		if (error) {
			logger.logToFile("Error ", error)
			return next({status:false})
		}
        if (rows.length == 0)
			return next({status:false})
		return next({status:true, data:rows})
	})
}

module.exports.getUserByEmail = function(email, next) {
	let db = database.getDBInstance()
	db.all(GET_USER_EMAIL_QUERY, [email], function(error, rows) {
		if (error) {
			logger.logToFile("Error ", error)
			return next({status:false})
		}
        if (rows.length == 0)
			return next({status:false})
		return next({status:true, data:rows[0]})
	})
}

module.exports.userGetOrgs = function(data, next) {
	let db = database.getDBInstance()
	db.all(GET_USER_ORGS_QUERY, [data],function(error, rows) {
		if (error) {
			logger.logToFile("Error ", error)
			return next(undefined)
		}
        if (rows.length == 0)
			return next(undefined)
		console.log("rows"+ rows)
		return next(rows)
	})
}

module.exports.userGetAllRoles = function(next) {
	let db = database.getDBInstance()
	db.all(GET_ALL_ROLES_QUERY, function(error, rows) {
		if (error) {
			logger.logToFile("Error ", error)
			return next(undefined)
		}
        if (rows.length == 0)
			return next(undefined)
		return next(rows)
	})
}

module.exports.createUser = function (data, next) {
    let db = database.getDBInstance()
    db.run(INSERT_USER_QUERY, [data.email, data.password], function(error) {
        if (error) 
            return next({status: 'error', data: error})
        next({status: 'success', data: this.lastID})
    })
}

module.exports.createOrgRole = function (data, next) {
    let db = database.getDBInstance()
	db.run(INSERT_ORG_ROLE_QUERY, 
		[data.org_id, data.role_id, data.user_id, data.enabled], 
		function(error) {
			if (error) 
				return next({status: 'error', data: error})
			next({status: 'success', data: this.lastID})
    })
}

module.exports.changeUserStatus = function (enabled, id, orgid, roleid, next) {
    let db = database.getDBInstance()
    db.run(UPDATE_USER_QUERY, [enabled, id, orgid, roleid], function(error) {
        if (error) 
            return next({status: 'error', data: error})
        next({status: 'success', data: this.lastID})
    })
}