const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const Connection = process.env.CONNECTION_STRINGPRODUCT

const connectproductDB =  async ()=>{
    await mongoose.connect(Connection)
    console.log('connected to product database')
}

module.exports = connectproductDB