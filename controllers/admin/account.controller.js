const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcryptjs")


module.exports.login = async(req,res) => {
    res.render("admin/pages/login.pug",{
    pageTitle : "Dang nhap"})
}
module.exports.loginPost = async(req,res) => {
   const { email,password} = req.body
    const exitAccount = await AccountAdmin.findOne({
        email : email
    })
    if(!exitAccount) {
         res.json ({
    code : "error",
    message : "email khong ton tai trong he thong"
   })
    }
    const isPasswordValid = bcrypt.compareSync(password, exitAccount.password);
   if(!isPasswordValid){
    res.json ({
    code : "error",
    message : "mat khau khong dung"
   })}
   if(exitAccount.status !="active") {
     res.json ({
    code : "error",
    message : "tai khoan chua duoc kich hoat"
   })
   }
    return res.json({
    code: "success",
    message: "Đăng nhập thành công"
  });
}

module.exports.register = async(req,res) => {
    res.render("admin/pages/register.pug",{
    pageTitle : "Dang ky"})
}




module.exports.registerPost = async(req,res) => {
   const { fullName,email,password} = req.body
   const exitAccount = await AccountAdmin.findOne({
    email : email
   })
   if(exitAccount){
    res.json({
        code : "error",
        message : "Email da ton tai trong he thong"
    })
    return // them de dung chuong trinh
   }
   //ma hoa mat khau voi bcrypt
const salt = bcrypt.genSaltSync(10); //tao chuoi ngau nhien 10 ki tu
const hashPassword = bcrypt.hashSync(password, salt);



   const newAccount = new AccountAdmin({
    fullName : fullName,
    email : email,
    password : hashPassword,
    status : "initial"
   })
   await newAccount.save()

   res.json ({
    code : "success",
    message : "Dang ky tai khoan thanh cong"
   })
}
module.exports.registerInitial = async(req,res) => {
    res.render("admin/pages/register-initial.pug",{
    pageTitle : "Tao tai khoan"})
}
module.exports.forgotPassword = async(req,res) => {
    res.render("admin/pages/forgot-password.pug",{
    pageTitle : "Quen mat khau"})
}
module.exports.otpPassword = async(req,res) => {
    res.render("admin/pages/otp-password.pug",{
    pageTitle : "OTP"})
}
module.exports.resetPassword = async(req,res) => {
    res.render("admin/pages/reset-password.pug",{
    pageTitle : "Doi mat khau"})
}
