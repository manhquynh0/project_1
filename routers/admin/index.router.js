const router = require("express").Router()
const accountRouters = require("./account.router")
const dashboardRouters = require("./dashboard.router")
const categoryRouters = require("./category.router")
router.use("/category",categoryRouters)
router.use('/account',accountRouters)
router.use('/dashboard',dashboardRouters)
module.exports = router