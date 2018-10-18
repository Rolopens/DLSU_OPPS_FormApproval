const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

function noSpaces(str){
  return !(/\s/.test(str));
}

var userSchema = mongoose.Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    lowercase : true,
    unique : true,
    validate : {
      validator : noSpaces,
      msg : "Email address cannot have spaces"
    }
  },
  password : {
    type : String,
    required : true,
  },
  firstname : {
    type : String,
    required : true,
  },
  lastname : {
    type : String,
    required : true,
  },
  date_disabled : Date,
  user_roles : [
    {
      org_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
      },
      role_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
      },
      enabled : {
        type : Boolean,
        required : true,
      }
    }
  ]
});

userSchema.pre("save", function(next){
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, saltRounds, function(err, hash){
    if(!err){
      user.password = hash;
      return next();
    }
  });
});

var User = mongoose.model("user", userSchema);

module.exports = {User};
