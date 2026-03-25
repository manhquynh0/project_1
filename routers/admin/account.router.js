const router = require("express").Router();
const accountValidate = require("../../validates/admin/account.validate")
const accountController = require("../../controllers/admin/account.controller")
router.get('/login',accountController.login)
router.post('/login',accountValidate.loginPost,accountController.loginPost)

router.get('/register',accountController.register)
router.post('/register',accountValidate.registerPost,accountController.registerPost)

router.get('/forgot-password',accountController.forgotPassword)
router.get('/otp-password',accountController.otpPassword)
router.get('/reset-password',accountController.resetPassword)
router.get('/register-initial',accountController.registerInitial)

router.post('/logout',accountController.logoutPost)
router.post('/forgot-password',accountController.forgotPasswordPost)


module.exports = router;
