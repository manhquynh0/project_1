const { pathAdmin } = require("../../config/variable")
const jwt = require("jsonwebtoken")
const AccountAdmin = require("../../models/account-admin.model")
try{


module.exports.verifyTokens = async (req,res,next) => {
    const token = req.cookies.token
    if(!token) {
        res.redirect(`/${pathAdmin}/account/login`)
        return
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const {id ,email} = decoded
    const exitAccount = await AccountAdmin.findOne({
        _id : id,
        email : email,
        status : "active"
    })
    if(!exitAccount){
        res.clearCookie("token")
        res.redirect(`/${pathAdmin}/account/login`)
        return
    }
    next()
}
}
catch(err){
        res.clearCookie("token")
        res.redirect(`/${pathAdmin}/account/login`)
}