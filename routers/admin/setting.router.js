const router = require("express").Router()
const multer = require('multer');
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });
const settingController = require("../../controllers/admin/setting.controller")
router.get("/list", settingController.list)
router.get("/website-info", settingController.websiteInfo)
router.patch("/website-info", upload.fields(
  [
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ]
), settingController.websiteInfoPatch)
router.get("/account-admin/list", settingController.accountAdminList)
router.get("/account-admin/create", settingController.accountAdminCreate)
router.post("/account-admin/create", upload.single('avatar'), settingController.accountAdminCreatePost)
router.get("/account-admin/edit", settingController.accountAdminEdit)
router.get("/role/list", settingController.rolelist)
router.get("/role/create", settingController.rolecreate)
router.post("/role/create", settingController.rolecreatePost)
router.get("/role/edit/:id", settingController.roleedit)
router.patch("/role/edit/:id", settingController.roleeditPatch)
router.patch("/role/delete/:id", settingController.roleDelete)
router.patch("/role/change-multi", settingController.roleChangeMulti)
router.patch("/account-admin/change-multi", settingController.changemultiPatch)
router.patch("/account-admin/delete/:id", settingController.accountAdminDelete)
router.get("/account-admin/edit/:id", upload.single('avatar'), settingController.accountAdminEdit)
router.patch("/account-admin/edit/:id", upload.single('avatar'), settingController.accountAdminEditPatch)
module.exports = router