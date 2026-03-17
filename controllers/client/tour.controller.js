const tour = require("../../models/tour.model")
module.exports.list  = async (req, res) => {
  const tourList = await tour.find({})
  console.log(tourList)
  res.render("client/pages/tour-list", {
    pageTitle: "danh sach tour",
    tourList: tourList // truyen vao tourlist

  })
}
