const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoSchema = new Schema (
      {
            name : {
                  type : String,
                  required : true,
                  maxlength: 50,
                  trim : true
            },
            currentPrice :{
                  type: Number,
                  trim : true
            },
            quantity :{
                  type : Number,
                  trim : true
            }
            


      },
      {
            timestamps: {createdAt: "created_at" , updatedAt : "updated_at"}
      }
);

const Crypto = mongoose.model ('Crypto', cryptoSchema);

module.exports = Crypto;