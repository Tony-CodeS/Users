const nodemailer = require("nodemailer");
const UserModel = require('../model/UserSchema')
const dotenv = require('dotenv')
dotenv.config()

const sendEmail = async (email, subject, text) => {
    const user = await UserModel.findOne({email})
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            //service: process.env.HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
      
        });
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
            //html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer'
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;