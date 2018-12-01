const mocha = require ('mocha');
const assert = require ('assert');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chai = require('chai');
const expect = chai.expect;

// Create a new schema that accepts an 'email' object.
// 'email' is a required field
//const testSchema = new Schema({
//  email: { type: String, required: true } 
//});

const formSchema = new Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    title: String,
    nature: String,
    org: String,
    typeOfActivity: String,
    startTime: String,
    endTime: String,
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    enmp: {
        type: Number
    },
    enp: {
        type: Number
    },
    venue: String,
    reach: String,
    online: Boolean,
    GOSM: Boolean,
    president: mongoose.Schema.Types.ObjectId,
    college: String,
    context: [String],
    objectives: [String],
    
    //Approval stuff
    status: String, //current status of the form
    approvedDate: Date, //date and time when the form is approved
    canView: [mongoose.Schema.Types.ObjectId],
    currentCheckers: [ mongoose.Schema.Types.ObjectId],
    approvedBy: [ mongoose.Schema.Types.ObjectId],
    position: Number, //Used for tracking the form
    processType: String,
    comments: String, //Comments given by the checker
    
    //tables
    projectHeads: [{
        name: String,
        contact_number: {
            type: Number
        }
    }],
    program_flow: [{
        startTime: String, //for now (used to be date)
        endTime: String, //for now (used to be date)
        duration: Number,
        activity: String,
        description: String,
        person: String //String???
    }],
//    before: [{ // not in the original form
//        
//    }],
    breakdown_expenses: {
        material: [{
            name: String,
            quantity: Number,
            unit_cost: Number,
            total_cost: Number
        }],
        total_expense: Number
    },
    source_funds: {
        organization_funds: Number,
        participants_fee: Number,
        others: Number,
        total: Number
    },
    projected_income: {
        revenue: [{
            item: String,
            quantity: Number,
            price: Number,
            amount: Number
        }],
        expenses: [{
            item: String,
            quantity: Number,
            price: Number,
            amount: Number
        }],
        total: Number
    },
    organizational_funds: {
        operational_fund: Number,
        depository_fund: Number,
        other_fund: Number,
//        accumulated_fund: Number,
        total_disbursement: Number,
        projected_expenses: Number,
        rem_balance: Number
    },
    person_responsible: [{ // another person responsible aside from the submitter
        name: String,
        position: String
    }],
    archived: Boolean,
    creationDate: Date
});

//Create a new collection called 'Email'
//const Email = mongoose.model('Email', testSchema);
const Form = mongoose.model("Form", formSchema);


describe('Database Tests', function() {
  //Making a sandboxed database connection

  before(function (done) {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      done();
    });
  });
    describe('Test Database', function(){
        it('New form to database', function(done){
            var form = new Form({
                    "title": "asss",
                    "nature": "nature",
                    "typeOfActivity": "type eh",
                    "enmp": 1,
                    "enp": 2,
                    "startDate": "11/23/1998",
                    "startTime": "10:56",
                    "endDate": "11/23/1998",
                    "endTime": "12:23",
                    "venue": "goks",
                    "reach": "reach",
                    "GOSM": true,
                    "online": true,
                    "context": ["hello", "hi", "huy"],
                    "objectives": ["to blabla", "to haha", "to huhu"],
                    "person_responsible": {
                        "name": "chesie",
                        "position": "santos"
                    },
                    "source_funds": {
                        "organization_funds": 1,
                        "participants_fee": 2,
                        "others": 3,
                        "total": 4
                    },
                    "organizational_funds": {
                        "operational_fund": 1,
                        "depository_fund": 2,
                        "other_fund": 3,
                        "total_disbursement": 4,
                        "projected_expenses": 5,
                        "rem_balance": 6
                    },
                    "program_flow": [{
                        "startTime": "11/23/1998", //for now (used to be date)
                        "endTime": "10:23", //for now (used to be date)
                        "duration": 1,
                        "activity": "activity name",
                        "description": "ano na ba???",
                        "person": "chesie santos" //String???
                    }],
                    "projectHeads": [{
                        "name": "cheseeee",
                        "contact_number": 4
                    }],
                    "breakdown_expenses":  {
                        material: [{
                            "name": "anna santos",
                            "quantity": 2,
                            "unit_cost": 3,
                            "total_cost": 4
                        }],
                        "total_expense": 5
                    },
                    "projected_income": {
                        "revenue": [{
                            "item": "item",
                            "quantity": 1,
                            "price": 2,
                            "amount": 3
                        }],
                        "expenses": [{
                            "item": "item",
                            "quantity": 2,
                            "price": 4,
                            "amount": 6
                        }],
                        "total": 3
                    },
                    "comments": "AMPANGET",
                    "position": 123,
                    "creationDate": new Date,
                    "org": "usersOrganization", //fix this later on to session
                    "status": "Pending",
                    "user_id": null
                });
            form.save(done)
        })
        
    })
    
//  describe('Test Database', function() {
//    //Save object with 'email' value of 'abc2@dlsu.edu.ph"
//    it('New email saved to test database', function(done) {
//      var testEmail = Email({
//        email: 'abc2@dlsu.edu.ph'
//      });
//        
//      testEmail.save(done);
//    });
//      
//    it('Dont save spaces to database', function(done) {
//      //save with spaces. Should be an error
//      var wrongFormat = Email({
//        notEmail: 'Not abc2@dlsu.edu.ph'
//      });
//      wrongFormat.save(err => {
//        if(err) { return done(); }
//        throw new Error('Wrong Email!');
//      });
//    });
//      
//    it('Should retrieve data from test database', function(done) {
//      //Look up the 'abc2@dlsu.edu.ph' object previously saved.
//      Email.find({email: 'abc2@dlsu.edu.ph'}, (err, email) => {
//        if(err) {throw err;}
//        if(email.length === 0) {throw new Error('No data!');}
//        done();
//      });
//    }); 
//  });
    
  //Close Connection
  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });
});