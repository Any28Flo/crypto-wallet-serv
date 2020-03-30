const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const User = require('./user-model');
const Crypo = require('./cripto-model');
const walletSchema = new Schema(
{
      name :{
            type: String,
            required : true,
            maxlength : 50,
            trim : true

      },
      description :{
            type : String,
            maxlength: 200,
            trim : true
      },
      coins : { type : Array},
      createdBy : {type : Schema.Types.ObjectId, ref: 'User'},
      
},
      {
            timestamps: {createdAt: "created_at" , updatedAt : "updated_at"}
      }

);
walletSchema.index({coin : 1 , name : 1} , { unique : true});
const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;