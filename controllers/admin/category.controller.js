module.exports.list = async(req,res) => {
    res.render("admin/pages/category-list", {
    pageTitle : "Dach sach danh muc"
    })
}
module.exports.create = async(req,res) => {
    res.render("admin/pages/category-create", {
    pageTitle : "Tao danh muc"
    })
}