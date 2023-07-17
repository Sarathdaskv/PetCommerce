const productModel = require('../model/productModel')
const categoryModel = require('../model/categoryModel');
const cartModel = require('../model/cartModel')
const wishlistModel = require('../model/wishlistModel')
const { ObjectId } = require('mongodb');

const getCategoryProducts = async (req, res) => {
    try {
        let categoryId = req.query.id;
        let userData = req.session.user
        let cartCount = null;
        let wishlistCount = null;
        if (req.session.userLoggedIn) {
            cartCount = await cartModel.findById(req.session.user._id)
            wishlistCount = await wishlistModel.findById(req.session.user._id)
        }
        let brands = await productModel.find({}, { brand: 1, _id: 0 })
        const productList = await productModel.find({ listed: true });
        const categoryList = await categoryModel.find();
        res.render('user/productList', { userData, cartCount, wishlistCount, category: categoryList, id: categoryId, products: productList })

    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const showAllProducts = async (req, res) => {
    try {
        let id = req.query.id;
        let limit = req.query.limit
        let products = await productModel.find({ listed: true, category: id }).limit(limit);
        res.send({
            products
        })

    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const filteredProducts = async (req, res) => {
    try {
        const id = req.body.categoryID;
        const limit = parseInt(req.body.limit) || 5;
        if (id == "" || id == undefined) {
            let products = await productModel.find({ listed: true }).limit(limit);
            res.send({
                products
            })
        }
        else {
            let products = await productModel.find({ category: id, listed: true }).limit(limit);
            res.send({
                products
            })
        }
    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

const viewMore = async (req, res) => {
    try {
        let categoryId = "64a9768097500a1b7b40fd8a"//dog food
        let userData = req.session.user
        let cartCount = null;
        let wishlistCount = null;
        if (req.session.userLoggedIn) {
            cartCount = await cartModel.findById(req.session.user._id)
            wishlistCount = await wishlistModel.findById(req.session.user._id)
        }

        const productList = await productModel.find({ listed: true });
        const categoryList = await categoryModel.find();
        res.render('user/productList', { userData, cartCount, wishlistCount, category: categoryList, id: categoryId, products: productList })

    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const showProductDetails = async (req, res) => {
    try {
        let productId=req.query.id
        let cartCount=null;
        let wishlistCount=null;
        let userData = req.session.user
        if (req.session.userLoggedIn) {
            cartCount = await cartModel.findById(req.session.user._id)
            wishlistCount = await wishlistModel.findById(req.session.user._id)
        }
        let productData=await productModel.find({_id:productId})
        let category=await categoryModel.find();
        
        res.render('user/productDetails',{userData, cartCount, wishlistCount ,productData,category})
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}


module.exports = { getCategoryProducts, filteredProducts, showAllProducts, viewMore, showProductDetails }