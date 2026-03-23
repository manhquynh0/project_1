
const mongoose = require("mongoose")
schema = {
    fullName : String,
    email : String,
    password : String,
    status : String
}
const AccountAdmin = mongoose.model("AccountAdmin",schema,"accounts-admin")
module.exports = AccountAdmin

