const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://bugbug:Quynh%402005@cluster0.w5nb9za.mongodb.net/tour-management');
const Tour = mongoose.model('Tour', {
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
  const tourList = await Tour.find({})
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