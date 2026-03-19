const router = require("express").Router()
const accountRouters = require("./account.router")
const dashboardRouters = require("./dashboard.router")
router.use('/account',accountRouters)
router.use('/dashboard',dashboardRouters)
module.exports = router