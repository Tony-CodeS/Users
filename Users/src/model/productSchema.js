const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    amount:{
        type:String,
        required: true
    },
    
    image:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const Product = mongoose.model('Products', productSchema)

module.exports = Product