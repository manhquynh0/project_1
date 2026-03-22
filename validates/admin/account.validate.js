const Joi = require("joi")

module.exports.regiterPost = (req,res,next) => {
   const schema = Joi.object({
    fullName : Joi.string().
    required().
    min(5).
    max(50).
    messages({
        "string.empty" : "Vui long nhap day du ho ten",
        "string.min(" : "Ho ten phai co it nhat 5 ki tu",
        "string.max" : "Ho ten toi da 50 ki tu"
    }),
    email : Joi.string().required().email().messages({
        "string.empty" : "Vui long nhap email",
        "string.email" : "emal khong dung dinh dang"
    }),
    password : Joi.string().required().messages({
        "string.empty" : "Vui long nhap mat khau"
    })
   })

   const {error} = schema.validate(req.body)
if(error){
    console.log(error)
    res.json({
        code : "error",
        message : "Loi"
    })
    return
}
   next()
}