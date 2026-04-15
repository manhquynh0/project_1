const City = require("../../models/city.model")
const Category = require("../../models/category.model")
const CategoryHelper = require("../../helpers/category.helper")
const Tour = require("../../models/tour.model")
const slugify = require('slugify');
const moment = require("moment");
const AccountAdmin = require("../../models/account-admin.model");
module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }
  // lọc theo tìm kiếm
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    });
    const keywordRegex = new RegExp(keyword);
    find.slug = keywordRegex;
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
  // lọc theo tìm kiếm

  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    });
    const keywordRegex = new RegExp(keyword);
    find.slug = keywordRegex;
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

  const totalRecord = await Tour.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const tourList = await Tour.find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip);

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };

  for (const item of tourList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoAccountCreated ? infoAccountCreated.fullName : "";
    } else {
      item.createdByFullName = "";
    }

    if (item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = infoAccountUpdated ? infoAccountUpdated.fullName : "";
    } else {
      item.updatedByFullName = "";
    }


    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }
  const categoryList = await Category.find({
    deleted: false
  })
  const CategoryTree = CategoryHelper.buildCategoryTree(categoryList)
  const accountAdminList = await AccountAdmin
    .find({})
    .select("id fullName"); // chi lay ra name


  res.render("admin/pages/tour-list", {
    pageTitle: "Quản lý tour",
    tourList: tourList,
    pagination: pagination,
    accountAdminList: accountAdminList,
    categoryList: CategoryTree,
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
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    if (req.files && req.files.avatar) {
      req.body.avatar = req.files.avatar[0].path;
    } else {
      delete req.body.avatar;
    }

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

    if (req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    } else {
      delete req.body.images;
    }

    const newRecord = new Tour(req.body);
    await newRecord.save();

    req.flash("success", "Tạo tour thành công!")
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Them that bai"
    })
  }
}

module.exports.edit = async (req, res) => {

  const id = req.params.id;

  const tourDetail = await Tour.findOne({
    _id: id,
    deleted: false
  })

  if (tourDetail) {
    tourDetail.locations = Array.isArray(tourDetail.locations) ? tourDetail.locations : [];
    tourDetail.schedules = Array.isArray(tourDetail.schedules) ? tourDetail.schedules : [];
    tourDetail.images = Array.isArray(tourDetail.images) ? tourDetail.images : [];
    tourDetail.avatar = tourDetail.avatar || "";
    tourDetail.information = tourDetail.information || "";
    tourDetail.time = tourDetail.time || "";
    tourDetail.vehicle = tourDetail.vehicle || "";
    tourDetail.departureDateFormat = tourDetail.departureDate ?
      moment(tourDetail.departureDate).format("YYYY-MM-DD") :
      "";

    const categoryList = await Category.find({
      deleted: false
    })

    const categoryTree = CategoryHelper.buildCategoryTree(categoryList);

    const cityList = await City.find({});

    res.render("admin/pages/tour-edit", {
      pageTitle: "Chỉnh sửa tour",
      categoryList: categoryTree,
      cityList: cityList,
      tourDetail: tourDetail
    })
  } else {
    res.redirect(`/${pathAdmin}/tour/list`);
  }

}
module.exports.editPatch = async (req, res) => {
  const id = req.params.id
  if (req.body.position) {
    req.body.positon = parseInt(req.body.position)
  } else {
    const totalRecord = Tour.countDocuments({})
    req.body.position = totalRecord + 1
  }
  req.body.updatedBy = req.account.id
  if (req.files && req.files.avatar) {
    req.body.avatar = req.files.avatar[0].path
  } else {
    delete req.body.avatar
  }
  if (req.files && req.files.images && req.files.images.length > 0) {
    req.body.images = req.files.images.map(file => file.path)
  } else {
    delete req.body.images
  }
  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
  req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
  req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
  req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
  req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
  req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
  req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
  req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

  await Tour.updateOne({
    _id: id,
    deleted: false
  }, req.body)
  req.flash("success", "Cập nhật thành công")
  res.json({
    code: "success"
  })

}
module.exports.trash = async (req, res) => {
  // loc theo tim kiem
  const find = {
    deleted: true
  }
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    });
    const keywordRegex = new RegExp(keyword);
    find.slug = keywordRegex;
  }
  const limitItems = 5;
  let page = 1;

  if (req.query.page) {
    const currentPage = parseInt(req.query.page);
    if (!isNaN(currentPage) && currentPage > 0) {
      page = currentPage;
    }
  }
  const totalRecord = await Tour.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const tourList = await Tour.find(find)
    .sort({
      deletedAt: "desc"
    })
    .limit(limitItems)
    .skip(skip);

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };
  for (const item of tourList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoAccountCreated ? infoAccountCreated.fullName : "";
    } else {
      item.createdByFullName = "";
    }

    if (item.deletedBy) {
      const infoAccountDeleted = await AccountAdmin.findOne({
        _id: item.deletedBy
      })
      item.deletedByFullName = infoAccountDeleted ? infoAccountDeleted.fullName : "";
    } else {
      item.deletedByFullName = "";
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
  }


  res.render("admin/pages/tour-trash.pug", {
    pageTitle: "Trash tour",
    tourList: tourList,
    pagination: pagination,
  })
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
        await Tour.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: option
        })
        req.flash("success", "Đổi trạng thái thành công")
        break;
      case "delete":
        await Tour.updateMany({
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
module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id
    await Tour.updateOne({
      _id: id,
      deleted: false
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    req.flash("success", "Xóa Thành Công")
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Xóa thất bại"
    })
  }
}
module.exports.changemultiTrash = async (req, res) => {
  try {
    const {
      option,
      ids
    } = req.body
    switch (option) {
      case "undo":
        await Tour.updateMany({
          _id: {
            $in: ids
          }
        }, {
          deleted: false
        })
        req.flash("success", "Đổi trạng thái thành công")
        break;
      case "delete-destroy":
        await Tour.deleteMany({
          _id: {
            $in: ids
          }
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
module.exports.undoTrash = async (req, res) => {
  try {
    const id = req.params.id;

    await Tour.updateOne({
      _id: id
    }, {
      deleted: false
    })

    req.flash("success", "Khôi phục tour thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}
module.exports.deleteTrash = async (req, res) => {
  try {
    const id = req.params.id;

    await Tour.deleteOne({
      _id: id
    })

    req.flash("success", "Xóa tour thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}