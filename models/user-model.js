const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
      username :{
          type: String,
          required: true,
          unique: true,
          maxlength:20,
          trim:true
      },
      password :{
          type: String,
          required: true,
          trim : true
      },
      email : {
          type: String,
          required: true,
          unique:true,
          trim:true
      },
      image: {
          type: String
      },
     
  
  },
  {
      timestamps: {createdAt: "created_at" , updatedAt : "updated_at"}
  });
//Hashed password
userSchema.pre('save', function(next) {
    if (this.isNew || !this.isModified('password')) {
      return next()
    }
  
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) {
        return next(err)
      }
  
      this.password = hash
      next()
    })
  });
  //CheckedPassword

  userSchema.methods.checkPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
      if (err) {
        callback(err);
      } else {
        callback(err, same);
      }
    });
  }
  const User = mongoose.model('User', userSchema);
  module.exports = User;