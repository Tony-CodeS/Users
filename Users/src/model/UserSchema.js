const { string } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
// const Joi = require('joi');
// const { options } = require('joi');
// const Joigoose = require("joigoose")(mongoose);






// const  joiUserSchema = Joi.object({
//     name: Joi.string().max(15).min(5).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(8).max(30).regex(/^[a-zA-Z0-9]{8,30}$/).required(),
//     tel: Joi.string().min(11).max(11).required(),
//     age: Joi.string().required()
   
//   });


const userSchema = new mongoose.Schema(
    // Joigoose.convert(joiUserSchema, options)
    {
        name:{
            type:String,
            required:true
        },

        email:{
            type:String,
            required:true
        },

        password:{
            type:String,
            // select:false,
            required:true
        },

        newpassword:{
            type:String,
            
        },

        confirmpassword:{
            type:String,
        },

        otp:{
            type:String,

        },
        amount:{
            type:Number,

        },
        otp_expire:{
            type:String
        },
        
        tel:{
            type:String,
            required:true
        },

        age:{
            type:String,
        },

        avatar:{
            type:String,
        },
        number:{
            type:String,
        },

        exp_month:{
            type:Number,
        },

        exp_year:{
            type:Number,
        },

        cvc:{
            type:String,
        },
        currency:{
            type:String
        },

        description:{
            type:String
        }
    },

    {
        timestamps:true
    }
)

userSchema.plugin(mongoosePaginate)
const UserModel = mongoose.model('Users', userSchema)

// const validate = (user) => {
//     const schema = Joi.object({
//         name: Joi.string().min(5).max(10).required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().required(),
//         age: Joi.string().required(),
//         tel: Joi.string().required()
//     });
//     return schema.validate(user);
// };

module.exports = UserModel
// module.exports = signInValidation