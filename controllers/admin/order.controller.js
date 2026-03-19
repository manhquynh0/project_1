module.exports.list = async (req,res) => {
    res.render("admin/pages/order-list.pug", {
    pageTitle : "Quan ly dat hang" 
})}
module.exports.edit =  async (req,res) => {
    res.render("admin/pages/order-edit.pug", {
    pageTitle : "Edit tour" 
})}