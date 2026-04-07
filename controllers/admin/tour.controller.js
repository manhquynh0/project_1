const City = require("../../models/city.model")
const Category = require("../../models/category.model")
const CategoryHelper = require("../../helpers/category.helper")
const Tour = require("../../models/tour.model")
module.exports.list = async (req, res) => {
    res.render("admin/pages/tour-list.pug", {
        pageTitle: "Quan ly tour"
    })
}
module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })
    const CategoryTree = CategoryHelper.buildCategoryTree(categoryList)
    const cityList = await City.find({})
    res.render("admin/pages/tour-create.pug", {
        pageTitle: "Tao tour",
        categoryList: CategoryTree,
        cityList: cityList
    })
}
module.exports.createPost = async (req, res) => {
   try {
    if (req.body.position) {
      req.body.position = parseInt(req.body.position)
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }
    req.body.createdBy = req.account.id
    req.body.updateBy = req.account.id
    req.body.avatar = req.file ? req.file.path : ""
    console.log(req.file)
    
  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
  req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
  req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
  req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
  req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
  req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
  req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
  req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];
  console.log(req.body)
    const newRecord = new Tour(req.body)
    await newRecord.save()
    req.flash("success", "Tạo danh mục thành công")
    res.json({
      code: "success",
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Tạo danh mục thất bại"
    })
  }
}
module.exports.edit = async (req, res) => {
    res.render("admin/pages/tour-edit.pug", {
        pageTitle: "Edit tour"
    })
}
module.exports.trash = async (req, res) => {
    res.render("admin/pages/tour-trash.pug", {
        pageTitle: "Trash tour"
    })
}