const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/DLSU_OPPS", {
    useNewUrlParser: true 
});
var Schema = mongoose.Schema;

var formSchema = new Schema({
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
    person_responsible: { // another person responsible aside from the submitter
        name: String,
        position: String
    },
    archived: Boolean,
    creationDate: Date
});

var Form = mongoose.model("Form", formSchema);

module.exports = {
    Form
}