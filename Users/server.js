const express = require('express')
const connectproductDB = require('./src/config/productConfig')
const connectDb = require('./src/config/userConfig')
//const verifyToken = require('./src/middlewares/verifyToken')
const router = require('./src/routers/userRoutes')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(express.json())
const PORT = process.env.PORT

app.get('/', (req, res) =>{
    res.send('Homepage')
})

app.use('/', router)

connectDb()
//connectproductDB()
app.listen(PORT, ()=>{
    console.log('Users Activated')
})