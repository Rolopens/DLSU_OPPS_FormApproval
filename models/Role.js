const mongoose = require("mongoose");

var RoleSchema = mongoose.Schema({

    name :{
        type : String,
        required : true,
        trim : true,
        unique : true
    }

});

var Role = mongoose.model("role", RoleSchema);

module.exports = {Role};
