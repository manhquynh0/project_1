const { pathAdmin } = require("../../config/variable")
const jwt = require("jsonwebtoken")
const AccountAdmin = require("../../models/account-admin.model")
const Role = require("../../models/role.model")

module.exports.verifyTokens = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            res.redirect(`/${pathAdmin}/account/login`)
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, email } = decoded
        const exitAccount = await AccountAdmin.findOne({
            _id: id,
            email: email,
            status: "active"
        })
        if (!exitAccount) {
            res.clearCookie("token")
            res.redirect(`/${pathAdmin}/account/login`)
            return
        }

        if (exitAccount.role) {
            const role = await Role.findOne({
                _id: exitAccount.role
            })
            exitAccount.roleName = role.name;
            req.permissions = role.permissions;
            res.locals.permissions = role.permissions;
        } else {
            exitAccount.roleName = "Không định dạng";
        }
        req.account = exitAccount; // cac file controller co the dung
        res.locals.account = exitAccount // cac file pug co the dung
        next()
    }
    catch (err) {
        res.clearCookie("token")
        res.redirect(`/${pathAdmin}/account/login`)
    }
}