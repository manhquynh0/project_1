module.exports.edit = async (req,res) => {
    res.render("admin/pages/profile-edit.pug", {
    pageTitle : "Thong tin ca nhan" 
})}
module.exports.changePassword = async (req,res) => {
    res.render("admin/pages/profile-change-password.pug", {
    pageTitle : "Doi mat khau" 
})}