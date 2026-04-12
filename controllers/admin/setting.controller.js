const SettingWebsiteInfo = require("../../models/setting-website-info.model")
const Role = require("../../models/role.model")
const permission = require("../../config/permission")
module.exports.list = async (req, res) => {
  res.render("admin/pages/setting-list", {
    pageTitle: "Cài đặt chung"
  })
}

module.exports.websiteInfo = async (req, res) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  res.render("admin/pages/setting-website-info", {
    pageTitle: "Thông tin website",
    settingWebsiteInfo: settingWebsiteInfo
  })
}

module.exports.websiteInfoPatch = async (req, res) => {
  if (req.files && req.files.logo) {
    req.body.logo = req.files.logo[0].path;
  } else {
    delete req.body.logo;
  }

  if (req.files && req.files.favicon) {
    req.body.favicon = req.files.favicon[0].path;
  } else {
    delete req.body.favicon;
  }
  console.log(req.body)
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  if (settingWebsiteInfo) {
    await SettingWebsiteInfo.updateOne({
      _id: settingWebsiteInfo.id
    }, req.body)
  } else {
    const newRecord = new SettingWebsiteInfo(req.body);
    await newRecord.save();
  }

  req.flash("success", "Cập nhật thành công!")

  res.json({
    code: "success"
  })
}

module.exports.accountAdminList = async (req, res) => {
  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tai khoan quan tri"
  })
}
module.exports.accountAdminCreate = async (req, res) => {
  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tao tai khoan quan tri"
  })
}
module.exports.accountAdminEdit = async (req, res) => {
  res.render("admin/pages/setting-account-admin-edit.pug", {
    pageTitle: "Sua tai khoan quan tri"
  })
}
module.exports.rolelist = async (req, res) => {
  const find = {
    deleted: false
  }
  if (req.query.keyword) {
    const keywordRegex = new RegExp(req.query.keyword, "i");
    find.name = keywordRegex;
  }
  const roleList = await Role.find(find)
    .sort({ createdAt: "desc" })

  res.render("admin/pages/setting-role-list.pug", {
    pageTitle: "Danh sách tai khoan quan tri",
    roleList: roleList
  })
}
module.exports.rolecreate = async (req, res) => {

  res.render("admin/pages/setting-role-create.pug", {
    pageTitle: "Sua tai khoan quan tri",
    permissionList: permission.permissionList
  })
}
module.exports.roleChangeMulti = async (req, res) => {
  try {
    const { option, ids } = req.body
    switch (option) {
      case "delete":
        await Role.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        })
        break;
    }
    req.flash("success", "Xóa thành công!")
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Lỗi hệ thống"
    })
  }
}
module.exports.rolecreatePost = async (req, res) => {
  req.body.created = req.account.id
  req.body.updated = req.account.id
  const role = new Role(req.body)
  await role.save()
  req.flash("success", "Thêm mới thành công!")
  res.json({
    code: "success"
  })
}
module.exports.roleeditPatch = async (req, res) => {
  try {
    const id = req.params.id
    await Role.updateOne({
      _id: id,
      deleted: false
    }, req.body)
    req.flash("success", "Cập nhật thành công!")
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ"
    })
  }
}
module.exports.roleedit = async (req, res) => {
  const id = req.params.id
  const roleDetail = await Role.findOne({
    _id: id,
    deleted: false
  })
  res.render("admin/pages/setting-role-edit.pug", {
    pageTitle: "Sua tai khoan quan tri",
    roleDetail: roleDetail,
    permissionList: permission.permissionList
  })
}
module.exports.roleDelete = async (req, res) => {
  try {
    const id = req.params.id
    await Role.updateOne({
      _id: id,
      deleted: false
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    req.flash("success", "Xóa thành công!")
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ"
    })
  }
}