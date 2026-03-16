const express = require('express')
const path = require('path')
const app = express()
const port = 3000

// Thiet lap view
app.set('views',path.join(__dirname,"views"))
app.set('view engine','pug')
//
app.get('/', (req, res) => {
  res.render("client/pages/home.pug" ,
    { pageTitle : "Trang chu"}
  )
})
app.get('/tours', (req,res) => {
   res.render("client/pages/tour-list" , {
    pageTitle : "danh sach tour"
})
})
app.get('/cart', (req,res) => {

   res.send("giooo hang")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

