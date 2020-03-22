const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const User = require('./user-model');
const Crypo = require('./cripto-model')
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
      coins : { type : Schema.Types.ObjectId , ref: 'Crypo'},
      createdBy : {type : Schema.Types.ObjectId, ref: 'User'},
      
},
      {
            timestamps: {createdAt: "created_at" , updatedAt : "updated_at"}
      }

);
const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;