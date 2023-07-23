const wishlistModel = require('../model/wishlistModel')
const cartModel = require('../model/cartModel')
const categoryModel = require('../model/categoryModel')
const productModel = require('../model/productModel')

const showWishlistPage = async (req, res) => {

    try {
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

        let category = await categoryModel.find();
        let wishlistData = await wishlistModel.findOne({ customer: userData._id }).populate("products")
        console.log(wishlistData);

        res.render('user/wishlist', { userData, cartCount: cart, wishlistCount: wishlist, category, wishList: wishlistData })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const addToWishList = async (req, res) => {
    try {

        if (req.session.user) {


            const userWishlist = await wishlistModel.findOne({
                customer: req.session.user._id,
            });
            if (userWishlist) {
                const product = await productModel.findById(req.body.productId);
                const productExist = await wishlistModel.findOne({
                    _id: userWishlist._id,
                    products: req.body.productId,
                });
                if (!productExist) {
                    await wishlistModel.findByIdAndUpdate(userWishlist._id, {

                        $push: {
                            products: [req.body.productId],
                        },

                    });

                    res.send({
                        status: true
                    })
                }
                else {
                    res.send({
                        status: "alreadyExists"
                    })
                }
            }
        }
        else {
            console.log("need to login first for accessing wishlist");
        }

    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const removeProduct = async (req, res) => {
    try {
        const userWishlist = await wishlistModel.findOne({
            customer: req.session.user._id,
        });
        if (userWishlist) {
           
            const productExist = await wishlistModel.updateOne(
                {
                    _id: userWishlist._id
                },
                {
                    $pull: {
                        products: req.body.id
                    }
                }
            );
            res.send({
                status: "deleted"
            })
        }
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}



module.exports = { showWishlistPage, addToWishList, removeProduct  } 