const UserModel = require('../model/UserSchema')
//const userOtpVerification = require('../model/userOtpVerification')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const cloudinary = require('../utilis/cloudinary')
const fs = require('fs')
const {registerUser, emailvalidation} = require('../validations/userValidation')
const crypto = require ('node:crypto')
//const Token = require('../model/token')
const moment = require('moment')
const otpGenerator = require('otp-generator')
const SignUpTemplate = require('../utilis/SignUpTemplate')
const sendEmail = require('../utilis/sendEmail')
const Email = require('../utilis/Email')
const stripe = require('stripe')('sk_test_51M81CHLyXOmixXmBTRAjVgxBl8e8h9ZDehDKsMz0NZrmpbIjdYWJq0wAqs2BALK3K3z8m2oDRrio6QMLRGuPlacF00HsC8gDyB');
const dotenv = require('dotenv')
dotenv.config()


const signup = async (req, res)=>{
    const {error} = await registerUser(req.body)

    if (error) return res.status(400).send({success:false, message:error.details[0].message})

    const {name, email, password, age,confirmpassword, tel} = req.body
    
    const smallName = name.toLowerCase()

    
    try{
 
        // Joi.validate(updateSchema)
    const user = await UserModel.findOne({email})

    if (user) return res.status(400).send({ success:false, message:'email already exist'})

    if(password !== confirmpassword) return res.status(400).send({success:false, message:'your passwords must match'})
    
    const Otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    //Math.floor(100000 + Math.random() * 900000);

    const OtpExpire = moment().add(10, "minutes");

    let hashedPassword = await bcrypt.hash(password, 12)

   
    const newUser = await UserModel.create({name:smallName, email, password:hashedPassword, age, otp:Otp, otp_expire:OtpExpire, tel})

    await newUser.save()

    delete newUser._doc.password

     
        await sendEmail(
            email,
            `Email verification code: ${Otp}`,
            SignUpTemplate(Otp, `${email}`)
          );


          res.status(200).send({
            success:true,
            message:"succesfully created User",
            data:newUser
        })
    }catch(err){
             res.status(400).send({
             success:false,
             message:`${err.message}`
            })
    }
}


const resendOtp = async (req, res) =>{
const {email} = req.body

let userInfo = await UserModel.findOne({email})
console.log(userInfo)

if (!userInfo) return res.status(400).send({success:false, message:'user not found'})

const Otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false , lowerCaseAlphabets:false});
//Math.floor(100000 + Math.random() * 900000);
console.log(Otp)

const OtpExpire = moment().add(10, "minutes");
const { name } = userInfo;

userInfo.otp = Otp

userInfo.otp_expire = OtpExpire

console.log(userInfo)

await userInfo.save()

await sendEmail(
    email,
    `Email verification code: ${Otp}`,
    SignUpTemplate(Otp, `${name}`)
  );

//   await Email(
//     email,
//     `Email verification code: ${Otp}`,
//   )

  res.status(200).send({
    success:true,
    message:"Otp has been resent",
    //data:newUser
})

}

const otpVerification = async (req, res)=>{
const {otp} = req.body
try{
let userInfo = await UserModel.findOne({otp})

console.log(userInfo)
console.log(userInfo.otp)
if(!userInfo) return res.status(400).send({success:false, message:'User not found'})


const { id, f_name, l_name, phone, otp_expire, } = userInfo;

if(otp !== userInfo.otp) return res.status(400).send({success:false, message:'your otp has to match'})
console.log(userInfo.otp)

const isValid = moment().isBefore(otp_expire, "seconds");

if(!isValid) return res.status(400).send({success:false, message:'otp has expired'})

const token = jwt.sign({id:userInfo._id, email:userInfo.email, password:userInfo.password}, process.env.JWTSECRET, )
delete userInfo._doc.password
res.status(200).send({
    success:true,
    message:"OTP Validated",
    data:userInfo,
    token:token
})


} catch(err){
    console.log(`${err.message}`)
}
}



















const signin = async (req, res)=>{
try{
const {email, password} = req.body

const user = await UserModel.findOne({email})

if(!user) return res.status(400).send({success:false, message: 'email not found'})

const validatePassword = await bcrypt.compare(password, user.password)

if(!validatePassword) return res.status(400).send({success:false, message: 'password not correct'})

const SECRET = process.env.JWTSECRET

const token = jwt.sign({id:user._id, email:user.email, password:user.password}, SECRET, )

res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });


delete user._doc.password

res.status(200).send({success:true, message:'Succesfully logged in', data: user, token:token})

} catch(err){
    res.status(400).send({
        success:false,
        message:`${err.message}`
    })
}
}

// const logout = async (req, res)=>{
//     res.clearCookie('nToken');
//     return res.redirect('/');
// }

const uploader = async (req, res)=>{
    const {id} = req.user

   // console.log({id})

    const uploader = async (path) => await cloudinary.uploads(path, 'User-profile')
    let url

    const file = req.file

    const {path} = file

    const newPath = await uploader(path)
   // console.log(newPath)

    url = newPath.url

    console.log({url})

    let user = await  UserModel.findOne({_id:id}, {password:0})
    
   

    user.avatar = url.toString()

    fs.unlinkSync(path)

    await user.save()

    res.status(200).send({
        message:`successfully uploaded a picture`,
        success: true,
        data:user
    })
}

const changepassword = async (req, res)=>{

    const {newpassword, password, confirmpassword} = req.body

    
    const UserId = req.params.personId 

   // const {id} = req.user
 try{

const user = await UserModel.findOne({_id:UserId})

if(!user) return res.status(400).send({success: false, message:'user does not exist'})

const validate = await bcrypt.compare(password, user.password)

if(!validate) return res.status(400).send({message:'your password is not correct'})

if (newpassword !== confirmpassword) return res.status(400).send({message:'passwords must match '})

const hashedpassword = await bcrypt.hash(newpassword, 12)

user.password = hashedpassword

//delete user._doc.password

await user.save()

delete user._doc.password

res.status(200).send({success:true, message:'successfully changed your password', data:user})
}catch(err){
    console.log(`${err.message}`)
}
}


const update = async (req, res)=>{
    const payload = req.body

    const UserId = req.params.personId   
try{
                 


const newUser = await UserModel.findOneAndUpdate ({_id:UserId},payload, {new:true})

res.status(200).send({success:true, message:'Sucessfully updated', data:newUser})

}catch(err){
    res.status(400).send({success:false, message:'Operation failed'})
    console.log(`${err.message}`)
}
}

const forgotpassword = async (req, res)=>{
    const {error} = await emailvalidation(req.body)
    if (error) return res.status(400).send({success:false, message:error.details[0].message})
    const email = req.body
    //console.log(email)
try{
    const user = await UserModel.findOne(email)
    //console.log(user)
    if(!user) return res.status(400).send({success:false, message: 'email does not exist'})

    const SECRET = process.env.JWTSECRET

    const token = jwt.sign({id:user._id}, SECRET, { expiresIn: '15m' })
 
    // console.log(token)
    //const message = 'jjjjjjj'
    const link = `${process.env.BASE_URL}/${user._id}/${token}`;
    
    // console.log(link)
    
    await sendEmail(user.email,"Password reset", link,);

    res.send("password reset link sent to your email account");
}catch(error){
    res.send("An error occured");
    console.log(`${error.message}`)
}
}


const passwordReset = async (req, res)=>{

try{
const user= await UserModel.findById(req.params.Userid)

if(!user.id) return res.status(400).send({message:'user not found'})

const SECRET = process.env.JWTSECRET


jwt.verify(req.params.token, SECRET, function(err, decoded) {
    if (err) {
  res.send(`${err.message}`)
    }
  });

if(req.body.password !== req.body.confirmpassword) return res.status(400).send({success:false, message:'your passwords must match'})

const hashedpassword = await bcrypt.hash(req.body.password, 12)

user.password = hashedpassword

await user.save()
  
delete user._doc.password      

res.status(200).send({message:'successfully changed password', data:user})

}catch(error){
    console.log(`${error.message}`)
}
}


//getting all users
const getUser = async (req, res)=>{


const {page , limit } = req.query
try{
    
    const total = await UserModel.countDocuments({});

    const user = await UserModel.find().skip((page - 1) * limit).limit(limit*1)

    //delete user._doc.password      
if(!user) return res.status(400).send({success:false, message:"no users" })

//JSON.parse(user)

//delete user._doc.password 
res.status(200).send({message:'all users', data:user, total, currentPage:page})

}catch(err){
console.log(err)
}
}


//searching for users
const search = async (req, res)=>{
    const name = req.body
    try{
const user = await UserModel.find(name , {password:0}, function (err, data) {
    if (err){
        console.log(err);
    }
    else{
       // console.log("First function call : ", data);
        res.status(400).send({data})
    }
})
console.log(user)

    }catch(err){
        console.log(`${err.message}`)
    }
}

const createStripCustomer = async (req, res)=>{

const {name, email, tel} = req.body

const param = {}
param.name = name
param.email = email
param.phone = tel
//param.amount= amount

const user = stripe.customers.create(param, (err, customer)=>{
    if(err){
        console.log(err)
    } if(customer){
        console.log(customer)
    }else{
        console.log('wrong')
    }
})

res.send({data:user})
}

const createStripeToken = async (req, res) =>{
    const {number, exp_month, exp_year, cvc} = req.body
let token = {}
try{
    token = await stripe.tokens.create({
        card: {
            number: number,
            exp_month: exp_month,
            exp_year: exp_year,
            cvc: cvc,
        }
    });
} catch(err){
    console.log(`${err.message}`)
}
    res.send(token)
}

const createCharge = async (req, res)=>{
const {amount, description, currency} = req.body
const tokenId = req.params.tokenId
let charge = {}
try{
    charge = await stripe.charges.create({
        amount: amount,
        currency: currency,
        source: tokenId,
        description: description
    })

console.log(charge)
    if(charge) return res.send('payment was successful', `${charge.receipt_url}`)

}catch(err){
    console.log(`${err.message}`)
}
}
      
module.exports = {signup,
     signin,
     changepassword,
     update, 
      uploader,
      passwordReset,
      search,
       forgotpassword,
       otpVerification,
       resendOtp,
       createStripeToken,
       createStripCustomer,
       createCharge,
      getUser}