const express = require('express')
const path = require('path')
require("dotenv").config()
const mongoose = require('mongoose');
mongoose.connect(process.env.database);
const tour = mongoose.model('Tour', {
  name: String,
  major: String,
  age: Number
}, )



const app = express()
const port = 3000

// Thiet lap view
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'pug')
//

//Thiết lâp thư mục chứa file tĩnh bên FE
app.use(express.static(path.join(__dirname, "public")))
//

app.get('/', (req, res) => {
  res.render("client/pages/home.pug", {
    pageTitle: "Trang chu"
  })
})
app.get('/tours', async (req, res) => {
  const tourList = await tour.find({})
  console.log(tourList)
  res.render("client/pages/tour-list", {
    pageTitle: "danh sach tour",
    tourList: tourList // truyen vao tourlist

  })
})
app.get('/cart', (req, res) => {

  res.send("giooo hang")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})