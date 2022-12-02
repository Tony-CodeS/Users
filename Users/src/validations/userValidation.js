const Joi = require('joi')

const registerUser = async (payload) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        age: Joi.string().required(),
        tel: Joi.string().required()
    }).unknown();
    return schema.validate(payload);
};

const emailvalidation = async(payload)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(), 
    }).unknown()
    return schema.validate(payload)
}

module.exports = {registerUser, emailvalidation}