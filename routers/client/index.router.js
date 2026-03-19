const router = require("express").Router()
const tourRouters  =require("./tour.router")
const homeRouters  =require("./home.router")
const cartRoters = require("./cart.router")
router.use("/tour",tourRouters)
router.use("/",homeRouters)
router.use("/cart",cartRoters)
module.exports = router;