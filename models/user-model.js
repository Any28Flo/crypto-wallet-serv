const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
      username :{type: String , required: true , unique: true, maxlength:20, trim:true},
      password :{ type: String, required: true, trim : true},
      email : { type: String, required: true, unique:true , trim:true},
      image: {type: String}
  
  },
  {
      timestamps: {createdAt: "created_at" , updatedAt : "updated_at"}
  });
//Hashed password

  //CheckedPassword
userSchema.method.checkPassword = function(password){
    const passwordHash = this.password;
    return new Promise((resolve, reject) =>{
        bcrypt.compare(password , passwordHash, (err, same) =>{
            if(err){
                return reject(err)
            }
            resolve(same)
        })
    })
}

  const User = mongoose.model('User', userSchema);
  module.exports = User;