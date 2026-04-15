const Contact = require("../../models/contact.model")
module.exports.contactPost = async (req, res) => {
    const { email } = req.body
    const exitEmail = await Contact.findOne({
        email: email,
        deleted: false
    })
    if (exitEmail) {
        res.json({
            code: "error",
            message: "Email đã được gửi đăng ký"
        })
        return;
    }
    newRecord = new Contact(req.body)
    await newRecord.save()
    req.flash("success", "Gửi Email đăng kí thành công")
    res.json({
        code: "success",
        message: "Gửi Email đăng kí thành công"
    })
}
