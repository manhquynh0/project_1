module.exports.login = async(req,res) => {
    res.render("admin/pages/login.pug",{
    pageTitle : "Dang nhap"})
}
module.exports.register = async(req,res) => {
    res.render("admin/pages/register.pug",{
    pageTitle : "Dang ky"})
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