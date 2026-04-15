const router = require('express').Router();

const contactController = require("../../controllers/admin/contact.controller");

router.get('/list', contactController.list)
router.patch('/delete/:id', contactController.deletePatch)

router.patch("/change-multi", contactController.changemultiPatch)
module.exports = router;