
/* database setup */
let values = require('./config')
let tables = require('./tables')
let initialValues = require("./initialValues")
let table_columns = require("./columns")
let query = require("./query")
let path = require('path')
let fs = require('fs');
let sqlite3 = require('sqlite3').verbose()
let logger = require("./../models/logService")

let getDBInstance = function () {

    if (!fs.existsSync(values.database.location)){
        fs.mkdirSync(values.database.location);
    }

    return new sqlite3.Database(path.join(values.database.location, values.database.name), (error, result) => {
        if (error) {
            console.log("[" + (new Date()).toLocaleString() + "] " + error)
            logger.logToFile("Error ", "Database Failure\n" + error)
        }
    })
} 

function createTableQuery (table, name) {
    let columns = table.columns
    let query = "CREATE TABLE " + name + " ( "
    query += columns.map(function(column) {
        return column.name + " " + column.type + " " + column.constraint
    }).join(", ") + ")"
    return query
}

function createInsertQuery (initialValues, name) {
    let rows = initialValues
    let query = "INSERT INTO " + name + " (" + table_columns[name].columns.map(function(col){
        return col;
    }).join(", ") 
    + ") VALUES "
    /*per row in the initial values*/ 
    query += rows.map(function(row) {
        return "(" + table_columns[name].columns.map(function(col){
            /*per column in the data*/
            if(row[col] == true)
                return 1;
            if(Number.isInteger(row[col]))
                return row[col];
            return "'" + row[col] + "'";
        }).join(", ") + ")"
    }).join(", ")
    query += ";"
    return query
}

let table_query = "SELECT name FROM sqlite_master WHERE type='table' AND name=?"

function checkIfTableExists (table, next) {
    let db = getDBInstance()
    db.all(table_query,[table], function(error, rows){
        if (error) {
			logger.logToFile("Error exists table", error)
			return next({status: 'error', data: false})
		}
        if (rows.length == 0)
            return next({status: 'success', data: true})
        return next({status: 'success', data: false})
    })
    //db.close()
}

function createTable(name, next) {
    let db = getDBInstance()
    db.run(createTableQuery(tables[name], name), function(error, row) {
        if (error) {
            console.log("[" + (new Date()).toLocaleString() + "] create table" +  error)
            return next(false)
        }
        return next(true)
    })
    //db.close()
}

function insertInitialValues(name) {
    let db = getDBInstance()
    db.run(createInsertQuery(initialValues[name], name), function(error, row) {
        if (error) {
            console.log("[" + (new Date()).toLocaleString() + "] " +  error)
        }
    })
    //db.close()
}

function insertOfficers(query, next) {
    let db = getDBInstance()
    db.run(query, function(error) {
        if (error) {
            console.log("[" + (new Date()).toLocaleString() + "] " +  error)
            return next(undefined)
        }
        return next(this.lastID)
    })
    //db.close()
}

function insertRole(query, org, user) {
    let db = getDBInstance()
    db.run(query, [org, user],function(error) {
        if (error) {
            console.log("[" + (new Date()).toLocaleString() + "] " +  error)
        }
    })
    //db.close()
}

function insertPeople(i, table, userQuery, roleQuery) {
    
    insertOfficers(userQuery, (user_id)=>{
        console.log(userQuery)
        //console.log(user_id)
        //if(user_id != undefined)
            //console.log("hey")
            //insertRole(roleQuery, i+1, user_id)
    })
}

function loopThroughOrgs(i, table){
    if(table[i].type == "USG" ||
    table[i].type == "CSO") {
        for(pos in query[table[i].type].users) {
            var userQuery = query[table[i].type].users[pos]
            var roleQuery = query[table[i].type].roles[pos]
            insertPeople(i, table, userQuery, roleQuery)
        }
    }
}

function initializeTable(name) {
    checkIfTableExists(name, function(message) {
        if (message.data) {
            createTable(name, function(create){
                if(create){
                    insertInitialValues(name)
                    // if(name == "organization"){
                    //     for(var i in initialValues[name]) {
                    //         //console.log(i)
                    //          var table =  initialValues.organization
                    //          loopThroughOrgs(i, table)
                    //     }
                    // }
                }
            })
        }
    })
}

function setupDatabase () {
    for (name in tables) {
        initializeTable(name)
    }
}
module.exports.getDBInstance = getDBInstance
setupDatabase()