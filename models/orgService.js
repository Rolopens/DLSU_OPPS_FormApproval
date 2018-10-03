let database = require('./../configuration/database')
let logger = require("./../models/logService")

let CHECK_USER_QUERY = "SELECT * FROM (((org_role NATURAL JOIN organization) " + 
                       "NATURAL JOIN users) NATURAL JOIN role) " + 
                       "WHERE (role_name = 'AFFILIATION_ADMIN' AND " +
                       "(abbrev = 'CSO' OR abbrev = 'OSEC')) AND " +
                       "user_id = ?"

let CHECK_USER_VIEW_QUERY = "SELECT * FROM (((org_role NATURAL JOIN organization) " + 
                            "NATURAL JOIN users) NATURAL JOIN role) " + 
                            "WHERE ((role_name = 'AFFILIATION_ADMIN' AND " +
                            "(abbrev = 'CSO' OR abbrev = 'OSEC'))" +
                            " OR (role_name = 'SYSTEM_ADMIN' AND abbrev = 'SLIFE'))" +
                            " AND user_id = ?"

let INSERT_ORG_QUERY = "INSERT INTO organization (name, abbrev, type, enabled) VALUES (?, ?, ?, ?)"

let UPDATE_ORG_QUERY = "UPDATE organization SET enabled = ? " +
                        "WHERE org_id = ?"

let UPDATE_ORG_NAME = "UPDATE organization SET name = ? , abbrev= ? " +
                        "WHERE org_id = ?"

let GET_ORG_NAME = "SELECT * FROM organization WHERE name = ? AND abbrev = ?"

let CHECK_USER_BY_ID_AND_TYPE_QUERY = "SELECT * FROM (((org_role NATURAL JOIN organization) " + 
"NATURAL JOIN users) NATURAL JOIN role) " + 
"WHERE user_id = ? AND type = ? AND role_name = 'AFFILIATION_ADMIN'"

let GET_ORG_QUERY = "SELECT * FROM organization WHERE org_id = ?"

let GET_ALL_ORGS_TYPE_QUERY = "SELECT * FROM organization WHERE type = ?"

let GET_ALL_ORGS_QUERY = "SELECT * FROM organization"

module.exports.userCanCreateOrg = function (uid, next) {
    let db = database.getDBInstance()
    db.all(CHECK_USER_QUERY, [uid], function(error, rows) {
        if (error) {
			logger.logToFile("Error ", error)
			return next({status: 'error', data: error})
		}
        if (rows.length == 0)
            return next({status: 'success', data: undefined})
        
        return next({status: 'success', data: rows[0]})
    })
}

module.exports.userCanSeeOrg = function (uid, next) {
    let db = database.getDBInstance()
    db.all(CHECK_USER_VIEW_QUERY, [uid], function(error, rows) {
        if (error) {
			logger.logToFile("Error ", error)
			return next({status: 'error', data: error})
		}
        if (rows.length == 0)
            return next({status: 'success', data: undefined})
        
        return next({status: 'success', data: rows[0]})
    })
}

module.exports.userCanEditOrg = function (uid, data, next) {
    let db = database.getDBInstance()
    db.all(CHECK_USER_BY_ID_AND_TYPE_QUERY, [uid, data.type], function(error, rows) {
        if (error) {
			logger.logToFile("Error ", error)
			return next(false)
        }
        if (rows.length == 0)
            return next(false)
        return next(true, data)
    })
}

// adding org
module.exports.createOrg = function (data, next) {
    let db = database.getDBInstance()
    db.run(INSERT_ORG_QUERY, [data.name, data.abbrev, data.type, data.enabled], function(error) {
        if (error) 
            return next({status: 'error', data: error})
        next({status: 'success', data: this.lastID})
    })
}

module.exports.changeOrgStatus = function (enabled, id, next) {
    let db = database.getDBInstance()
    db.run(UPDATE_ORG_QUERY, [enabled, id], function(error) {
        if (error) 
            return next({status: 'error', data: error})
        next({status: 'success', data: this.lastID})
    })
}

module.exports.getOrg = function (data, next) {
    console.log("GET ORG"+ data)
    let db = database.getDBInstance()
    db.all(GET_ORG_QUERY, [data], function(error, rows) {
        if (error) { 
            console.log("err")
            return next({status: 'error', data: error})
        }
        if (rows.length == 0)
            return next({status: 'success', data: undefined})
        next({status: 'success', data: rows[0]})
    })
}

module.exports.getAllOrgs = function ( next) {
    let db = database.getDBInstance()
    db.all(GET_ALL_ORGS_QUERY, function(error, rows) {
        if (error) { 
            console.log("err")
            return next(undefined)
        }
        if (rows.length == 0)
            return next(undefined)
        next(rows)
    })
}

module.exports.getAllTypeOrgs = function (data, next) {
    let db = database.getDBInstance()
    db.all(GET_ALL_ORGS_TYPE_QUERY, [data], function(error, rows) {
        if (error) { 
            console.log("err")
            return next(undefined)
        }
        console.log("here" + rows)
        if (rows.length == 0)
            return next(undefined)
        next(rows)
    })
}

module.exports.changeOrgName = function (name, abbrev, id, next) {
    let db = database.getDBInstance()
    db.run(UPDATE_ORG_NAME, [name, abbrev, id], function(error) {
        if (error) 
            return next({status: 'error', data: error})
        next({status: 'success', data: this.lastID})
    })
}

module.exports.getOrgName = function (name, abbrev, next) {
    let db = database.getDBInstance()
    db.all(GET_ORG_NAME, [name, abbrev], function(error, rows) {
        if (error) { 
            console.log("err")
            return next(undefined)
        }

        // no duplicates
        if (rows.length == 0)
            return next(false)
        // there are duplicates
        next(true)
    })
}
