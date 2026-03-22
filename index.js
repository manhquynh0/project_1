const express = require('express')
const path = require('path')
require("dotenv").config()
const database = require("./config/database")
const adminRouters =require("./routers/admin/index.router")
const clientRouters =require("./routers/client/index.router")
const variableConfig = require("./config/variable")
const cookieParser = require("cookie-parser");

const app = express()
const port = 3000

//Ket noi database 
database.connect()
// Thiet lap view
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'pug')
//

//Thiết lâp thư mục chứa file tĩnh bên FE
app.use(express.static(path.join(__dirname, "public")))
//
// tao bien toan cuc trong file pug
app.locals.pathAdmin = variableConfig.pathAdmin
//
//tao bien toan cuc trong cac file ben backend
global.pathAdmin = variableConfig.pathAdmin
// cho phep gui data len dang json
app.use(express.json())
//

// su dung cookie-parse
app.use(cookieParser())
//
app.use(`/${variableConfig.pathAdmin}`,adminRouters)
app.use("/", clientRouters)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})