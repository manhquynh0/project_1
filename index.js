const express = require('express')
const path = require('path')
require("dotenv").config()
const mongoose = require('mongoose');
mongoose.connect(process.env.database);

const clientRouters =require("./routers/client/index.router")

const app = express()
const port = 3000

// Thiet lap view
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'pug')
//

//Thiết lâp thư mục chứa file tĩnh bên FE
app.use(express.static(path.join(__dirname, "public")))
//

app.use("/", clientRouters)


app.get('/cart', (req, res) => {
  res.send("giooo hang")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})