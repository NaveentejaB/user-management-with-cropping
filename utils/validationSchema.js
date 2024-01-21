const Joi = require("joi")

module.exports.admin_validation = (body) => {
    const schema = Joi.object({
        admin_id :Joi.number().min(1000).label('admin_id').required(),
        admin_password : Joi.string().label("admin_password").required(),
    })
    return schema.validate(body)
}


module.exports.user_validation = (body) => {
    const schema = Joi.object({
        user_id :Joi.number().min(1000).label('user_id').required(),
        user_password : Joi.string().label("user_password").required(),
    })
    return schema.validate(body)
}



