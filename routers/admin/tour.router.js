const router = require("express").Router()
const tourController = require("../../controllers/admin/tour.controller")
router.get("/list",tourController.list)
router.get("/create",tourController.create)
router.get("/edit",tourController.edit)
router.get("/trash",tourController.edit)
module.exports = router