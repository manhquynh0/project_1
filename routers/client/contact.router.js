const router = require('express').Router();
const contactController = require("../../controllers/client/contact.controller")
router.post("/create", contactController.contactPost)
module.exports = router;