// packages

// defined in model
const {
    Form
} = require("../models/preactsForm.js");

/*
    Accepts: Form object
    return: new promise that resolves the newly added form
    Adds a form into the database
*/
module.exports.addForm = function (form) {
    return new Promise(function (resolve, reject) {
        //Create DB form object
        //var form = new Form(form);
        
        //Save object in database and check if it resolves
        form.save().then((newForm) => {
            resolve(newForm)
        }, (err) => {
            reject(err)
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
}

/*
    Accepts: Title of Activity (STRING)
    return: new promise that resolves the form found
    Search database with title
*/
module.exports.findFormViaTitle = function (title) {
    return new Promise(function (resolve, reject) {
        
        //Search for db with the title with the substring
        Form.find({
            title: {
                $regex: title
            },
            archived: false
        }).then((similarForm) => {
            resolve(similarForm)
        }, (err) => {
            reject(err)
        })
    })
}

/*
    Accepts: _id (OBJECTID)
    return: new promise that resolves the form found
    Search database with certain objectID
*/
module.exports.findFormViaId = function (_id) {
    return new Promise(function (resolve, reject) {

        //Search for db with the title with the substring
        Form.findOne({
            _id
        }).then((similarForms) => {
            resolve(similarForms)
        }, (err) => {
            reject(err)
        })
    })
}

/*
    Accepts: nothing
    return: new promise that resolves all forms in db
    Gets all forms in the db
*/
module.exports.getAllForms = function (){
    return new Promise(function (resolve, reject) {
        Form.find().then((results)=>{
            //console.log(results)
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: user id
    return: new promise that resolves all forms in db
    Gets all forms in the db that has user id in current checkers list
*/
module.exports.getAllFormsViaCurrentCheckerID = function (user_id){
    return new Promise(function (resolve, reject) {
        Form.find({
            currentCheckers: user_id,
            archived: false,
        }).sort({
            creationDate: -1
        }).then((results)=>{
            //console.log(results)
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: string, user id
    return: new promise that resolves all forms in db
    Gets all forms in the db checked by a user containing a certain string
*/
module.exports.getAllFormsWithStringMatch = function(user_id, query){
    return new Promise(function (resolve, reject) {
        Form.find({
            currentCheckers: user_id,
            archived: false,
//            title: /g/i
//            title: query
            title: new RegExp(query, "i")
        }).sort({
            creationDate: -1
        }).then((results)=>{            
//            console.log(user_id);
//            console.log(query);
//            console.log(results)
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: string, user id
    return: new promise that resolves all forms in db
    Gets all forms in the db owned by a user containing a certain string
*/
module.exports.getAllOwnedFormsWithStringMatch = function(user_id, query){
    return new Promise(function (resolve, reject) {
        Form.find({
            user_id,
            archived: false,
//            title: /g/i
//            title: query
            title: new RegExp(query, "i")
        }).sort({
            creationDate: -1
        }).then((results)=>{            
//            console.log(user_id);
//            console.log(query);
//            console.log(results)
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: user_id
    return: new promise that resolves all forms owned by 'user_id' in the db
    Gets all forms in the db owned by 'user_id'
*/
module.exports.getAllFormsOfOwner = function (id){
    return new Promise(function (resolve, reject) {
        Form.find({
            user_id: id,
            archived: false
        }).sort({
            creationDate: -1
        }).then((results)=>{
            //console.log(results)
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: Form object
    return: new promise that returns the newly updated form
    Adds a form into the database
*/
module.exports.updateForm = function (form) {
    return new Promise(function (resolve, reject) {

        //Search for db with the title with the substring
        Form.findOneAndUpdate({
            _id: form.id
        }, {
            user_id: form.user_id,
            title: form.title,
            nature: form.nature,
            typeOfActivity: form.typeOfActivity,
            enmp: form.enmp,
            enp: form.enp,
            venue: form.venue,
            context: form.context,
            objectives: form.objectives,
            status: form.status,
            comments: form.comments,
            position: form.position,
            projectHeads: form.projectHeads,
            currentCheckers: form.currentCheckers,
            startDate: form.startDate,
            startTime: form.startTime,
            //endDate: form.endDate,
            endTime: form.endTime,
            reach: form.reach,
            GOSM: form.GOSM,
            online: form.online,
            person_responsible: form.person_responsible,
            sourceFunds: form.sourceFunds,
            organizational_funds: form.organizational_funds,
            program_flow: form.program_flow,
            breakdown_expenses: form.breakdown_expenses,
            projected_income: form.projected_income,
            org: form.org, 
            processType: form.processType,
            archived: form.archived,
            prevForm_id: form.prevForm_id

        }).then((updatedForms) => {
            resolve(updatedForms)
        }, (err) => {
            reject(err)
        })
    })
}

/*
    Accepts: _id(Objectid)
    return: new promise that returns the result / deleted object
    Deletes a form into the database
*/
module.exports.deleteFormViaId = function (_id) {
    return new Promise(function (resolve, reject) {
        Form.remove({
            _id
        }).then((result) => {
            resolve(result)
        }, (err) => {
            reject(err)
        })
    })
}

/*
    Accepts: nothing
    return: new promise that resolves all forms in db
    Gets all forms in the db owned by 'user_id', sorted by date of creation (ascending)
*/
module.exports.sortEventDateAsc = function (id){
    return new Promise(function (resolve, reject) {
        Form.find({
            user_id: id,
            archived: false
        }).sort({
            startDate: 1
        }).then((results)=>{
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: nothing
    return: new promise that resolves all forms in db
    Gets all forms in the db owned by 'user_id', sorted by date of creation (descending)
*/
module.exports.sortEventDateDesc = function (id){
    return new Promise(function (resolve, reject) {
        Form.find({
            user_id: id,
            archived: false
        }).sort({
            startDate: -1
        }).then((results)=>{
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: nothing
    return: new promise that resolves all forms in db
    Gets all forms in the db owned by 'user_id', sorted by date of form submission (ascending)
*/
module.exports.sortFormDateAsc = function (id){
    return new Promise(function (resolve, reject) {
        Form.find({
            user_id: id,
            archived: false
        }).sort({
            creationDate: 1
        }).then((results)=>{
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

/*
    Accepts: nothing
    return: new promise that resolves all forms in db
    Gets all forms in the db owned by 'user_id', sorted by date of form submission (descending)
*/
module.exports.sortFormDateDesc = function (id){
    return new Promise(function (resolve, reject) {
        Form.find({
            user_id: id,
            archived: false
        }).sort({
            creationDate: -1
        }).then((results)=>{
            resolve(results)
        }, (err)=> {
            reject(err)
        })
    })
}

