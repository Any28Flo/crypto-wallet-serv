const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
      username :{type: String , required: true , maxlength:20, trim:true},
      password :{ type: String, required: true, maxlength: 100, trim : true},
      email : { type: String, required: true, unique:true , trim:true},
      image: {type: String}
  
  },
  {
      timestamps: {createdAt: "created_at" , updatedAt : "updated_at"}
  });
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;