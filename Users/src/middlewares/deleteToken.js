const JWT = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const deleteToken = async (req, res, next)=>{
try{
//    
if(!authHeader || !authHeader.startsWith('Bearer ')){
    res
    .status(401)
    .json({message:'', success:false})   
}
next();
}catch(error){
    console.log(error)
}
}

module.exports = deleteToken