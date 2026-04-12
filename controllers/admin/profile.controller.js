const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcryptjs");
module.exports.edit = async (req, res) => {
    res.render("admin/pages/profile-edit.pug", {
        pageTitle: "Thong tin ca nhan"
    })
}
module.exports.editPatch = async (req, res) => {
    const id = req.account.id
    if (req.file) {
        req.body.avatar = req.file.path
    }
    else {
        delete req.body.avatar
    }
    console.log(req.file)
    await AccountAdmin.updateOne({
        _id: id,
        deleted: false
    }, req.body)
    req.flash("success", "Cập nhật thành công!")
    res.json({
        code: "success"
    })
}
module.exports.changePassword = async (req, res) => {
    res.render("admin/pages/profile-change-password.pug", {
        pageTitle: "Doi mat khau"
    })
}
module.exports.changePasswordPatch = async (req, res) => {
    try {
        const id = req.account.id;

        req.body.updatedBy = id;

        // Mã hóa mật khẩu với bcrypt
        const salt = await bcrypt.genSalt(10); // Tạo ra chuỗi ngẫu nhiên có 10 ký tự
        req.body.password = await bcrypt.hash(req.body.password, salt);

        await AccountAdmin.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Đổi mật khẩu thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: error
        })
    }
}