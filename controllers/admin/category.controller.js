const Category = require("../../models/category.model")
const categoryHelper = require("../../helpers/category.helper");
module.exports.list = async (req, res) => {
    res.render("admin/pages/category-list", {
        pageTitle: "Dach sach danh muc"
    })
}
module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })
    const categoryTree = categoryHelper.buildCategoryTree(categoryList)

    console.log(categoryTree)
    res.render("admin/pages/category-create", {
        pageTitle: "Tao danh muc",
        categoryList : categoryTree
    })
}
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    if (req.body.position) {
        req.body.position = parseInt(req.body.position)
    } else {
        const totalRecord = await Category.countDocuments({});
        req.body.position = totalRecord + 1;
    }
    req.body.createdBy = req.account.id
    req.body.updateBy = req.account.id
    req.body.avatar = req.file ? req.file.path : ""
    console.log(req.file)
    const newRecord = new Category(req.body)
    await newRecord.save()

    res.json({
        code: "success",
        message: "Tao danh muc thanh cong"
    })
}