const router = require("express").Router()
const tourRouters  =require("./tour.router")
const homeRouters  =require("./home.router")

router.use("/tours",tourRouters)
router.use("/",homeRouters)

module.exports = router;