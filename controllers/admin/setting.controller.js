const SettingWebsiteInfo = require("../../models/setting-website-info.model")
const Role = require("../../models/role.model")
const permission = require("../../config/permission")
const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcrypt")
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
  const find = {
    deleted: false
  }
  // lọc theo vai trò
  if (req.query.role) {
    find.role = req.query.role
  }
  // lọc theo tìm kiếm
  if (req.query.keyword) {
    const keywordRegex = new RegExp(req.query.keyword, "i");
    find.fullName = keywordRegex;
  }
  //loc theo gia
  const priceFilter = {}
  if (req.query.priceMin || req.query.priceMax) {
    if (req.query.priceMin) {
      const priceMin = req.query.priceMin
      priceFilter.$gte = priceMin
    }
    if (req.query.priceMax) {
      const priceMax = req.query.priceMax
      priceFilter.$lte = priceMax
    }
  }
  if (Object.keys(priceFilter).length > 0) {
    find.priceNewAdult = priceFilter;
  }
  //loc theo danh muc 
  if (req.query.category) {
    find.category = req.query.category
  }
  // loc theo trang thai
  if (req.query.status) {
    find.status = req.query.status
  }
  // loc theo nguoi tao
  if (req.query.createdBy) {
    find.createdBy = req.query.createdBy
  }

  // loc theo ngay tao
  const dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate; // lớn hơn hoặc bằng
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate; // nhỏ hơn hoặc bằng
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  // Phân trang 

  const limitItems = 5;
  let page = 1;

  if (req.query.page) {
    const currentPage = parseInt(req.query.page);
    if (!isNaN(currentPage) && currentPage > 0) {
      page = currentPage;
    }
  }

  const totalRecord = await AccountAdmin.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };
  const accountAdminList = await AccountAdmin.find(find)
    .sort({ createdAt: "desc" })
    .limit(limitItems)
    .skip(skip);
  const roleList = await Role.find({
    deleted: false
  })
  for (const item of accountAdminList) {
    if (item.role) {
      const role = await Role.findOne({
        _id: item.role,
        deleted: false
      });
      item.roleName = role ? role.name : "Không có";
    } else {
      item.roleName = "Không có";
    }
  }

  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tai khoan quan tri",
    accountAdminList: accountAdminList,
    pagination: pagination,
    roleList: roleList
  })
}
module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({
    deleted: false
  })
  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tao tai khoan quan tri",
    roleList: roleList
  })
}
module.exports.accountAdminCreatePost = async (req, res) => {
  if (req.file) {
    req.body.avatar = req.file.path;
  }
  const exitAccount = await AccountAdmin.findOne({
    email: req.body.email,
  })
  if (exitAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại!"
    })
    return
  }
  req.body.createdBy = req.account.id
  req.body.updatedBy = req.account.id
  const salt = await bcrypt.genSalt(10); // Tạo ra chuỗi ngẫu nhiên có 10 ký tự
  req.body.password = await bcrypt.hash(req.body.password, salt);
  const accountAdmin = new AccountAdmin(req.body)
  await accountAdmin.save()
  req.flash("success", "Thêm mới thành công!")
  res.json({
    code: "success"
  })
}
module.exports.accountAdminEdit = async (req, res) => {
  const id = req.params.id;
  const accountAdminDetail = await AccountAdmin.findOne({
    _id: id,
    deleted: false
  })
  const roleList = await Role.find({
    deleted: false
  })
  res.render("admin/pages/setting-account-admin-edit.pug", {
    pageTitle: "Sua tai khoan quan tri",
    accountAdminDetail: accountAdminDetail,
    roleList: roleList
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
module.exports.changemultiPatch = async (req, res) => {
  try {
    const {
      option,
      ids
    } = req.body
    switch (option) {
      case "active":
      case "inactive":
        await AccountAdmin.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: option
        })
        req.flash("success", "Đổi trạng thái thành công")
        break;
      case "delete":
        await AccountAdmin.updateMany({
          _id: {
            $in: ids
          }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        })
        req.flash("success", "Xóa thành công")
        break;
    }
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ"
    })
  }
}
module.exports.accountAdminDelete = async (req, res) => {
  try {
    const id = req.params.id
    await AccountAdmin.updateOne({
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
module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const id = req.params.id
    if (req.file) {
      req.body.avatar = req.file.path;
    }

    const existEmail = await AccountAdmin.findOne({
      _id: id,
      email: req.body.email,
      deleted: false
    });

    if (existEmail) {
      res.json({
        code: "error",
        message: "Email đã tồn tại!"
      });
      return;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      delete req.body.password;
    }

    req.body.updatedBy = req.account.id;

    await AccountAdmin.updateOne({
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