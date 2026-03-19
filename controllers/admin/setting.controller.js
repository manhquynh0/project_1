module.exports.list = async (req,res) => {
    res.render("admin/pages/setting-list.pug", {
    pageTitle : "CAI DAT" 
})}
module.exports.websiteinfo = async (req,res) => {
    res.render("admin/pages/setting-website-info.pug", {
    pageTitle : "Thong tin web" 
})}
module.exports.accountAdminList = async (req,res) => {
    res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle : "Tai khoan quan tri" 
})}
module.exports.accountAdminCreate = async (req,res) => {
    res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle : "Tao tai khoan quan tri" 
})}
module.exports.accountAdminEdit = async (req,res) => {
    res.render("admin/pages/setting-account-admin-edit.pug", {
    pageTitle : "Sua tai khoan quan tri" 
})}
module.exports.rolelist = async (req,res) => {
    res.render("admin/pages/setting-role-list.pug", {
    pageTitle : "Sua tai khoan quan tri" 
})}
module.exports.rolecreate = async (req,res) => {
    res.render("admin/pages/setting-role-create.pug", {
    pageTitle : "Sua tai khoan quan tri" 
})}
module.exports.roleedit = async (req,res) => {
    res.render("admin/pages/setting-role-edit.pug", {
    pageTitle : "Sua tai khoan quan tri" 
})}