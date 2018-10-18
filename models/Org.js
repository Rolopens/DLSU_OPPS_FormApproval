const mongoose = require("mongoose");

var OrgSchema = mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim : true
    },
    abbrev : {
        type: String,
        required : true,
        uppercase: true,
        unique : true
    },
    type : {
        type : String,
        required : true
    },
    enabled : {
        type : Boolean,
        required : true
    }
});

var Org = mongoose.model("org", OrgSchema);

module.exports = {Org};
