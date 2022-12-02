const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const Connection = process.env.CONNECTION_STRING

const connectDb = async ()=>{
    await mongoose.connect(Connection)
    console.log('Successfully Connected to  User Database')
}


module.exports = connectDb