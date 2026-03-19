module.exports.list = async (req,res) => {
    res.render("admin/pages/tour-list.pug", {
    pageTitle : "Quan ly tour" 
})}
module.exports.create =  async (req,res) => {
    res.render("admin/pages/tour-create.pug", {
    pageTitle : "Tao tour" 
})}
module.exports.edit =  async (req,res) => {
    res.render("admin/pages/tour-edit.pug", {
    pageTitle : "Edit tour" 
})}
module.exports.edit =  async (req,res) => {
    res.render("admin/pages/tour-trash.pug", {
    pageTitle : "Trash tour" 
})}