const categoryHelper = require("../../helpers/category.helper")
const category = require("../../models/category.model")
module.exports.list = async (req, res, next) => {
    const categoryList = await category.find({
        deleted: false,
        status: "active"
    })
    const categoryTree = categoryHelper.buildCategoryTree(categoryList)
    res.locals.categoryList = categoryTree
    next()
}
