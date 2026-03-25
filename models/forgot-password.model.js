const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    email : String,
    otp : String,
    exprieAt : {
        type : Date,
        expires :0
    }
},
{
    timestamps : true // TU DONG sinh ra truong creatAt va updateAt
})
const ForgotPassword = mongoose.model('ForgotPassword',schema,"forgot-password")
module.exports = ForgotPassword