const Category = require("../../models/category.model")
const moment = require("moment")
const Tour = require("../../models/tour.model")
const categoryHelper = require("../../helpers/category.helper")
module.exports.home = async (req, res) => {
  // section 2
  const tourListSection2 = await Tour.find({
    deleted: false,
    status: "active"
  }).sort({ position: "desc" })
    .limit(4)
  if (tourListSection2) {
    tourListSection2.forEach(item => {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    })
  }
  // end section2 

  //section 4 
  const categoryIDsection4 = "69dc5d3f5ade0869beae4613"
  const listcategoryID = await categoryHelper.getAllSubcateId(categoryIDsection4)
  const tourListSection4 = await Tour.find({
    category: { $in: listcategoryID },
    deleted: false,
    status: "active"
  }).sort({ position: "desc" })
    .limit(4)
  if (tourListSection4) {
    tourListSection4.forEach(item => {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    })
  }
  res.render("client/pages/home.pug", {
    pageTitle: "Trang chu",
    tourListSection2: tourListSection2,
    tourListSection4: tourListSection4
  })
}