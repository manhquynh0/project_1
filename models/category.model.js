const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const schema = new mongoose.Schema({
   name : String,
   parent : String,
   position : String,
   status : String,
   avatar : String,
   createdBy : String,
   updateBy : String,
   slug :{
    type :String,
    slug : "name",// theo truong name
    unique: true 
},
   deleted : {
    type : Boolean,
    default : false
   },
   deletedBy : String,
   deletedAt: Date,
   description : String,
},
{
    timestamps : true // TU DONG sinh ra truong creatAt va updateAt
})
const Category = mongoose.model('Category',schema,"categories")
module.exports = Category