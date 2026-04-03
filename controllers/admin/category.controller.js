const Category = require("../../models/category.model")
const categoryHelper = require("../../helpers/category.helper");
const AccountAdmin = require("../../models/account-admin.model")
module.exports.list = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  }).sort({
    position: "desc"
  })

  for (let item of categoryList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy,
      })
      item.createdByFullName = infoAccountCreated ? infoAccountCreated.fullName : ""
    } else {
      item.createdByFullName = ""
    }

    if (item.updateBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updateBy,
      })
      item.updatedByFullName = infoAccountUpdated ? infoAccountUpdated.fullName : ""
    } else {
      item.updatedByFullName = ""
    }

    item.createdAtFormat = item.createdAt ?
      item.createdAt.toLocaleString("vi-VN") :
      ""
    item.updatedAtFormat = item.updatedAt ?
      item.updatedAt.toLocaleString("vi-VN") :
      ""
  }
  res.render("admin/pages/category-list", {
    pageTitle: "Dach sach danh muc",
    categoryList: categoryList
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
    categoryList: categoryTree
  })
}
module.exports.createPost = async (req, res) => {
  try {
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
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id
    if (req.body.position) {
      req.body.position = parseInt(req.body.position)
    } else {
      const totalRecord = await Category.countDocuments({});
      req.body.position = totalRecord + 1;
    }
    req.body.updateBy = req.account.id
    if (req.file) {
      req.body.avatar = req.file.path
    } else {
      delete req.body.avatar
    }

    await Category.updateOne({
      _id: id,
      deleted: false
    }, req.body)
    req.flash("success", "Cập nhật danh mục thành công")
    res.json({
      code: "success",
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Cập nhật danh mục thất bại"
    })
  }
}
module.exports.edit = async (req, res) => {
  try {
    const categoryList = await Category.find({
      deleted: false
    })
    const categoryTree = categoryHelper.buildCategoryTree(categoryList)

    const id = req.params.id
    const categoryDetail = await Category.findOne({
      _id: id,
      deleted: false
    })
    console.log(categoryDetail)
    res.render("admin/pages/category-edit", {
      pageTitle: "Cap nhat danh muc",
      categoryList: categoryTree,
      categoryDetail: categoryDetail
    })
  } catch (error) {
    res.render("admin/pages/error-404.pug", {
      pageTitle: "Lỗi"
    })
  }
}
module.exports.deletePatch = async (req, res) => {
  try {

    const id = req.params.id

    await Category.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    req.flash("success", "Xoa thanh cong")
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "ID khong hop le"
    })
  }
}