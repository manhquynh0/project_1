const mongoose = require("mongoose")
const schema = new mongoose.Schema({
   name : String,
   parent : String,
   position : String,
   status : String,
   avatar : String,
   createdBy : String,
   updateBy : String,
   slug :String,
   deleted : {
    type : Boolean,
    default : false
   },
   deletedBy : String,
   description : String,
},
{
    timestamps : true // TU DONG sinh ra truong creatAt va updateAt
})
const Category = mongoose.model('Category',schema,"categories")
module.exports = Category