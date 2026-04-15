const Contact = require("../../models/contact.model")
const moment = require("moment");
module.exports.list = async (req, res) => {
  console.log(req.query.keyword)
  const find = {
    deleted: false
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

    const keywordRegex = new RegExp(req.query.keyword);
    find.email = keywordRegex;
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

  const totalRecord = await Contact.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const contactList = await Contact.find(find)
    .sort({ name: "asc" })
    .limit(limitItems)
    .skip(skip);

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };

  for (const item of contactList) {
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YYYY");
  }
  res.render("admin/pages/contact-list", {
    pageTitle: "Thông tin liên hệ",
    contactList: contactList,
    pagination: pagination
  })
}
module.exports.deletePatch = async (req, res) => {
  const id = req.params.id
  await Contact.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedBy: req.account.id,
    deletedAt: Date.now()
  }
  )
  req.flash("success", "Xóa Thành Công")
  res.json({
    code: "success",
  })
}
module.exports.changemultiPatch = async (req, res) => {
  const { ids, option } = req.body
  switch (option) {
    case "delete":
      await Contact.updateMany({
        _id: { $in: ids },
        deleted: false
      }, {
        deleted: true,
        updatedBy: req.account.id,
        updatedAt: Date.now()
      })
      req.flash("success", "Đổi trạng thái thành công")
  }
  res.json({
    code: "success"
  })
}