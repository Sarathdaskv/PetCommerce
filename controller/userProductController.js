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
        let cart = 0;
        let wishlist = 0;
        if (req.session.userLoggedIn) {
            cartCount = await cartModel.find({ customer: userData._id })
            cart = cartCount[0].totalQuantity;
            wishlistCount = await wishlistModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSize: {
                            $sum: {
                                $size: "$products"
                            }
                        }
                    }
                }
            ])
            wishlist = parseInt(wishlistCount[0].totalSize);
        }
        let brands = await productModel.find({}, { brand: 1, _id: 0 })
        const productList = await productModel.find({ listed: true });
        const categoryList = await categoryModel.find();
        res.render('user/productList', { userData, cartCount: cart, wishlistCount: wishlist, category: categoryList, id: categoryId, products: productList })

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
        let cart = 0;
        let wishlist = 0;
        if (req.session.userLoggedIn) {
            cartCount = await cartModel.find({ customer: userData._id })
            cart = cartCount[0].totalQuantity;
            wishlistCount = await wishlistModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSize: {
                            $sum: {
                                $size: "$products"
                            }
                        }
                    }
                }
            ])
            wishlist = parseInt(wishlistCount[0].totalSize);
        }

        const productList = await productModel.find({ listed: true });
        const categoryList = await categoryModel.find();
        res.render('user/productList', { userData, cartCount: cart, wishlistCount: wishlist, category: categoryList, id: categoryId, products: productList })

    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const showProductDetails = async (req, res) => {
    try {
        let productId = req.query.id
        let cartCount = null;
        let wishlistCount = null;
        let cart = 0;
        let wishlist = 0;
        let userData = req.session.user
        if (req.session.userLoggedIn) {
            cartCount = await cartModel.find({ customer: userData._id })
            cart = cartCount[0].totalQuantity;
            wishlistCount = await wishlistModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSize: {
                            $sum: {
                                $size: "$products"
                            }
                        }
                    }
                }
            ])
            wishlist = parseInt(wishlistCount[0].totalSize);
        }
        let productData = await productModel.find({ _id: productId })
        let category = await categoryModel.find();

        res.render('user/productDetails', { userData, cartCount: cart, wishlistCount: wishlist, productData, category })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const searchProducts = async (req, res) => {
    try {

        let products = await productModel.find({
            listed: true,
            name: {
                $regex: req.body.searchInput,
                $options: "i"
            }
        })

        res.send({
            products
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const sortBy = async (req, res) => {
    try {
        req.session.listing = await productModel.find({ listed: true });
        let listing = req.session.listing;
        if (req.body.sortBy === "ascending") {
            let products=await productModel.find({ listed: true }).sort({discountPrice:1})
            
            res.send({
                products
            })
        } else if (req.body.sortBy === "descending") {
            let products=await productModel.find({ listed: true }).sort({discountPrice:-1})
           
            res.send({
                products
            })
        } 
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

module.exports = { getCategoryProducts, filteredProducts, showAllProducts, viewMore, showProductDetails, searchProducts, sortBy }