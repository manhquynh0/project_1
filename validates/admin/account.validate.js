const Joi = require("joi")
module.exports.registerPost = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi
            .string()
            .required()
            .min(5)
            .max(50)
            .messages({
                "string.empty": "Vui long nhap mat khau",
                "string.min": "Ten phai it nhat 5 ki tu",
                "string.max": "Ten toi da co 50 ki tu"

            }),
        email: Joi
            .string()
            .required()
            .email()
            .messages({
                "string.empty": "Vui long nhap email",
                "string.email": "emal khong dung dinh dang"
            }),
        password: Joi
            .string()
            .required()
            .min(8)
            .custom((value, helpers) => {
                if (!/[A-Z]/.test(value)) {
                    return helpers.error("password.uppercase")
                }
                if (!/[a-z]/.test(value)) {
                    return helpers.error("password.lowercase")
                }
                if (!/\d/.test(value)) {
                    return helpers.error("password.number")
                }
                if (!/[@$!%*?&]/.test(value)) {
                    return helpers.error("password.special")
                }
            })
            .messages({
                "string.empty": "Vui long nhap mat khau",
                "string.min": "Mat khau phai it nhat 8 ki tu",
                "password.uppercase": "Mat khau phai chua it nhat mot chu cai in hoa",
                "password.lowercase": "Mat khau phai chua it nhat mot chu cai thuong",
                "password.number": "Mat khau phai chua it nhat mot chu so",
                "password.special": "Mat khau phai chua it nhat mot ki tu dac biet",
            })
    })

    const {
        error
    } = schema.validate(req.body)
    if (error) {
        console.log(error)
        res.json({
            code: "error",
            message: "Loi"
        })
        return
    }
    next()
}
module.exports.loginPost = (req, res, next) => {
    const schema = Joi.object({
        email: Joi
            .string()
            .required()
            .email()
            .messages({
                "string.empty": "Vui long nhap email",
                "string.email": "emal khong dung dinh dang"
            }),
        password: Joi
            .string()
            .required()
            .min(8)
            .custom((value, helpers) => {
                if (!/[A-Z]/.test(value)) {
                    return helpers.error("password.uppercase")
                }
                if (!/[a-z]/.test(value)) {
                    return helpers.error("password.lowercase")
                }
                if (!/\d/.test(value)) {
                    return helpers.error("password.number")
                }
                if (!/[@$!%*?&]/.test(value)) {
                    return helpers.error("password.special")
                }
            })
            .messages({
                "string.empty": "Vui long nhap mat khau",
                "string.min": "Mat khau phai it nhat 8 ki tu",
                "password.uppercase": "Mat khau phai chua it nhat mot chu cai in hoa",
                "password.lowercase": "Mat khau phai chua it nhat mot chu cai thuong",
                "password.number": "Mat khau phai chua it nhat mot chu so",
                "password.special": "Mat khau phai chua it nhat mot ki tu dac biet",
            }),
        rememberPassword: Joi.boolean()
    })

    const {
        error
    } = schema.validate(req.body)
    if (error) {
        console.log(error)
        res.json({
            code: "error",
            message: "Loi"
        })
        return
    }
    next()

}
module.exports.otpPasswordPost = (req, res, next) => {
    const schema = Joi.object({
        otp: Joi
            .string()
            .required()
            .messages({
                "string.empty": "Vui long nhap OTP",
            }),
        email: Joi
            .string()
            .required()
            .email()
            .messages({
                "string.empty": "Vui long nhap email",
                "string.email": "Email khong dung dinh dang"
            })
    })
    const {
        error
    } = schema.validate(req.body)
    if (error) {
        console.log(error)
        res.json({
            code: "error",
            message: "Loi"
        })
        return
    }
    next()

}
module.exports.resetPasswordPost = (req, res, next) => {
    const schema = Joi.object({
        password: Joi
            .string()
            .required()
            .min(8)
            .custom((value, helpers) => {
                if (!/[A-Z]/.test(value)) {
                    return helpers.error("password.uppercase")
                }
                if (!/[a-z]/.test(value)) {
                    return helpers.error("password.lowercase")
                }
                if (!/\d/.test(value)) {
                    return helpers.error("password.number")
                }
                if (!/[@$!%*?&]/.test(value)) {
                    return helpers.error("password.special")
                }
            })
            .messages({
                "string.empty": "Vui long nhap mat khau",
                "string.min": "Mat khau phai it nhat 8 ki tu",
                "password.uppercase": "Mat khau phai chua it nhat mot chu cai in hoa",
                "password.lowercase": "Mat khau phai chua it nhat mot chu cai thuong",
                "password.number": "Mat khau phai chua it nhat mot chu so",
                "password.special": "Mat khau phai chua it nhat mot ki tu dac biet",
            }),
       
    })

    const {
        error
    } = schema.validate(req.body)
    if (error) {
        console.log(error)
        res.json({
            code: "error",
            message: "Loi"
        })
        return
    }
    next()

}
