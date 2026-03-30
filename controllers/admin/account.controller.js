const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { generateOTP } = require("../../helpers/generate.helper")
const ForgotPassword = require("../../models/forgot-password.model")
const mailHelper = require("../../helpers/mail.helper")
module.exports.login = async(req,res) => {
    res.render("admin/pages/login.pug",{
    pageTitle : "Dang nhap"})
}
module.exports.loginPost = async(req,res) => {
   const { email,password,rememberPassword} = req.body
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
   // jwt
   const token = jwt.sign({
    id : exitAccount.id,
    email : exitAccount.email
   },
   process.env.JWT_SECRET,
   {
    expiresIn : rememberPassword ? "30d" : "1d" // luu mat khau
   }
)
console.log(req.cookies)
// luu token vao cookie
   res.cookie("token",token,{
    maxAge :rememberPassword ? ( 30*24 * 60 * 60 * 1000) :( 24 * 60 * 60 * 1000)   , // luu duoi dang milisenconds
    httpOnly : true ,// cookie chi co the truy cap boi may chu web
    sameSite : "strict"
   })
    return res.json({
    code: "success",
    message: "Đăng nhập thành công"})
}
module.exports.forgotPasswordPost = async(req,res) => {
       const { email} = req.body
    const exitAccount = await AccountAdmin.findOne({
        email : email
    })
    if(!exitAccount){
        res.json({
            code : "error",
            message : "Email khong ton tai trong he thong"
        })
        return
    }
    // kiem tra xem email da ton tai trong forgotpass hay chua
    const exitEmailforgot = await ForgotPassword.findOne({
        email : email
    })
    if(exitEmailforgot){
         res.json({
            code : "error",
            message : "Vui long gui lai sau 1 phut"
        })
        return
    }
    const otp = generateOTP()
    console.log(otp)

    const newRecord = new ForgotPassword({
        email : email,
        otp : otp,
        expireAt:new Date(Date.now() + 60*1000)
    }) 
    await newRecord.save()
       res.json({
            code : "success",
            message : "Mã OTP đã được gửi dến Email của bạn"
        })
// gui otp tu dong
mailHelper.sendMail(email,otp);
}
module.exports.logoutPost = async(req,res) => {
    res.clearCookie("token")
    res.json({
        code : "success",
        message : "dang xuat thanh cong"
    })
}
module.exports.register = async(req,res) => {
    res.render("admin/pages/register.pug",{
    pageTitle : "Dang ky"})
}
module.exports.registerPost = async(req,res) => {
    const {fullName,email,password} = req.body
    const exitAccount = await AccountAdmin.findOne({
        email : email
    })
    if(exitAccount){
        res.json({
            code : "error",
            message  :"email da duoc dang ki"
        })
        return
    }
    // ma hoa mat khau su dung bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newAccount = new AccountAdmin ({
        fullName : fullName,
        email : email,
        password : hashPassword,
        status : "initial"
    })
    await newAccount.save()
      res.json({
            code : "success",
            message  :"dang ki thanh cong"
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
module.exports.otpPasswordPost = async(req,res) => {
   const {email,otp} = req.body

   const exitRecord = await ForgotPassword.findOne({
    email : email,
    otp : otp
   })
   if(!exitRecord){
      res.json({
    code : "error",
    data : "OTP không chính xác"
   })
   return
 }

   const account=await AccountAdmin.findOne({
    email : email
   })
   // jwt
   const token = jwt.sign({
    id : account.id,
    email : account.email
   },
   process.env.JWT_SECRET,
   {
    expiresIn :"1d" // luu mat khau
   }
)
console.log(req.cookies)
// luu token vao cookie
   res.cookie("token",token,{
    maxAge :( 24 * 60 * 60 * 1000)   , // luu duoi dang milisenconds
    httpOnly : true ,// cookie chi co the truy cap boi may chu web
    sameSite : "strict"
   })
    return res.json({
    code: "success",
    message: "Xac thuc OTP thành công"
})

}
module.exports.resetPassword = async(req,res) => {
    res.render("admin/pages/reset-password.pug",{
    pageTitle : "Doi mat khau"})
}
module.exports.resetPasswordPost = async(req,res) => {
const{password} = req.body
const salt = await bcrypt.genSaltSync(10);
const hashPassword = await bcrypt.hashSync(password, salt);
await AccountAdmin.updateOne(
    {
    _id : req.account.id
},
{
    password : hashPassword
})
res.json({
    code : "success",
    message : "Đổi mật khẩu thành công"
})
}
