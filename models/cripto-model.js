const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Wallet = require('./wallet-model');

const cryptoSchema = new Schema (
      {
            name : {
                  type : String,
                  required : true,
                  maxlength: 50,
                  trim : true,
                  unique : true
            },
            quantity :{
                  type : Number,
                  trim : true
            },
            wallet :{
                  type : Schema.Types.ObjectId, ref: 'Wallet',
                  
            }
      },
      {
            timestamps: {createdAt: "created_at" , updatedAt : "updated_at"}
      }
);

cryptoSchema.index({wallet : 1 , name : 1} , {unique: true});
const Crypto = mongoose.model ('Crypto', cryptoSchema);

module.exports = Crypto;