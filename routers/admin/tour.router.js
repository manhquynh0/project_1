const router = require("express").Router()
const multer = require("multer")
const tourController = require("../../controllers/admin/tour.controller")
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const tourValidate = require("../../validates/admin/tour.validate")
const upload = multer({storage : cloudinaryHelper.storage})
router.get("/list",tourController.list)
router.get("/create",tourController.create)
router.get('/edit/:id', tourController.edit)
router.get('/trash', tourController.trash)
router.post("/create",upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),tourValidate.createPost,tourController.createPost)
router.patch("/change-multi",tourController.changemultiPatch)
router.patch("/trash/change-multi",tourController.changemultiTrash)
router.patch("/edit/:id",upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),tourController.editPatch)
router.patch("/delete/:id",tourController.deletePatch)
module.exports = router