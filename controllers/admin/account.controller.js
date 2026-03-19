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