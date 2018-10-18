let database = require('./../configuration/database')   

let ROLE_ORG_EXISTS_QUERY = "SELECT * FROM org_role WHERE org_id = ? AND role_id = ?"

module.exports.roleOrgExists = function (rid, oid, next) {
    let db = database.getDBInstance()
    db.all(ROLE_ORG_EXISTS_QUERY, [oid, rid], function(error, rows) {
        if (error) {
			logger.logToFile("Error ", error)
			return next(false)
        }
        if (rows.length == 0)
            return next(false)
        return next(true)
    })
}