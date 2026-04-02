const Joi = require("joi")
module.exports.categoryPost = (req, res, next) => {
    const schema = Joi.object({
        name: Joi
            .required()
            .messages({
                "string.empty": "Vui lòng nhập tên danh mục",
            }),
        parent: Joi
            .string().allow(""),
        status: Joi
            .string().allow(""),
        position: Joi
            .string().allow(""),
        avatar: Joi
            .string().allow(""),
        description: Joi
            .string().allow(""),
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
module.exports.editPatch = (req, res, next) => {
    const schema = Joi.object({
        name: Joi
            .required()
            .messages({
                "string.empty": "Vui lòng nhập tên danh mục",
            }),
        parent: Joi
            .string().allow(""),
        status: Joi
            .string().allow(""),
        position: Joi
            .string().allow(""),
        avatar: Joi
            .string().allow(""),
        description: Joi
            .string().allow(""),
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