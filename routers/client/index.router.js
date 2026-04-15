const router = require("express").Router()
const tourRouters = require("./tour.router")
const homeRouters = require("./home.router")
const cartRoters = require("./cart.router")
const categoryRouters = require("./category.route")
const contactRouters = require("./contact.router")
const categoryMiddeware = require("../../middlewares/client/category.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const searchRouters = require("./search.router")
router.use(settingMiddleware.websiteInfo);
router.use(categoryMiddeware.list)
router.use("/search", searchRouters)
router.use("/tour", tourRouters)
router.use("/", homeRouters)
router.use("/cart", cartRoters)
router.use("/category", categoryRouters)
router.use("/contact", contactRouters)
module.exports = router;