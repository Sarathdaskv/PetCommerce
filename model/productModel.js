const mongoose = require('mongoose')
const categoryList = require('./categoryModel')



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: categoryList,
        require,
    },
    brand: {
        type: String,
        require,
    },
    description: {
        type: String,
        require,
    },
    varientName: {
        type: String,//1kg,2kg,5kg
        required: true,
        default:'', 
       
    },
    price: {
        type: Number,
        require,
    },
    discountPrice: {
        type: Number,
        require,
    },
    inventory: Number,


    thumbnail: {
        type: String,
        require,
    },
    frontImage: {
        type: String,
        require,
    },
    images: [String],

    listed: {
        type: Boolean,
        default: true
    },

})



const productList = mongoose.model("productDetails", productSchema);


module.exports =  productList  