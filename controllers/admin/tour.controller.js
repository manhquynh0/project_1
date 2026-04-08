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
      name: "asc"
    })
    .limit(limitItems)
    .skip(skip);

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };

  for (let item of tourList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy,
      })
      item.createdByFullName = infoAccountCreated ? infoAccountCreated.fullName : ""
    } else {
      item.createdByFullName = ""
    }

    if (item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy,
      })
      item.updatedByFullName = infoAccountUpdated ? infoAccountUpdated.fullName : ""
    } else {
      item.updatedByFullName = ""
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
      req.body.position = parseInt(req.body.position)
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }
    req.body.createdBy = req.account.id
    req.body.updatedBy = req.account.id
    req.body.avatar = req.file ? req.file.path : ""

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
          deleteAt: Date.now()
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