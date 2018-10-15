const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/OPPS');
var Schema = mongoose.Schema;

var formSchema = new Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    title: String,
    nature: String,
    typeOfActivity: String,
    date: {
        type: Date
    },
    enmp: {
        type: Number
    },
    enp: {
        type: Number
    },
    venue: String,
    context: String,
    objectives: [String],
    state: String, //State of the form
    comments: String, //Comments given by the checker
    position: String, //Used for tracking the form
    projectHeads: [{
        name: String,
        contact_number: {
            type: Number
        }
    }]

});

var Form = mongoose.model("Form", formSchema);