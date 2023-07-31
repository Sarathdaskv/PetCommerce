const categoryModel = require('../model/categoryModel')
const couponModel = require('../model/couponModel')
const productModel = require('../model/productModel')
const cartModel = require('../model/cartModel');
const wishlistModel = require('../model/wishlistModel')
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');
const { response } = require('express');

const addToCart = async (req, res) => {
  try {
    if (req.session.user) {
      let productId = req.body.productId;
      const wishlistCheck = await wishlistModel.findOne({
        customer: req.session.user._id,
        products: new mongoose.Types.ObjectId(productId),
      });
      if (wishlistCheck) {
        await wishlistModel.findByIdAndUpdate(wishlistCheck._id, {
          $pull: {
            products: productId,
          },
        });

      }

      const userCart = await cartModel.findOne({ customer: req.session.user._id })
      const product = await productModel.findById(productId)
      const productExist = await cartModel.findOne({
        _id: userCart._id,
        products: {
          $elemMatch: { name: new mongoose.Types.ObjectId(productId) },
        },
      });
      //console.log(productExist);
      if (productExist) {
        await cartModel.updateOne(
          {
            _id: userCart._id,
            products: {
              $elemMatch: { name: new mongoose.Types.ObjectId(productId) },
            },
          },
          {
            $inc: {
              "products.$.quantity": 1,
              totalPrice: product.discountPrice,
              totalQuantity: 1,
              "products.$.price": product.discountPrice,
            },
          }
        );
        res.json({
          status: "countAdded",

        });


      }
      else {
        await cartModel.findByIdAndUpdate(userCart._id, {
          $push: {
            products: [
              {
                name: new mongoose.Types.ObjectId(productId),
                price: product.discountPrice,
              },
            ],
          },
          $inc: {
            totalPrice: product.discountPrice,
            totalQuantity: 1,
          },
        });
        res.send({
          status: "addedToCart"
        })
      }

    }
    else {
      res.send({
        status: false
      })
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const showCart = async (req, res) => {
  try {
    if (req.session.user) {
      let cartCount = null;
      let wishlistCount = null;
      let cart = 0;
      let wishlist = 0;
      let userData = req.session.user;
      let cartProducts = await cartModel.findOne({ customer: userData._id }).populate("products.name")
      // console.log(cartProducts);
      if (req.session.userLoggedIn) {
        cartCount = await cartModel.findOne({ customer: userData._id })
        cart = cartCount.totalQuantity;
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
      let totalAmount = await cartModel.find({ customer: userData._id })
      let totalPrice = totalAmount.totalPrice;
      const category = await categoryModel.find();
      res.render('user/cart', { category, userData, cartProducts, cartCount: cart, totalAmount: totalPrice, wishlistCount: wishlist })
    }
    else {
      console.log("Need to login first");
      res.redirect('/')
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const reduceCount = async (req, res) => {
  try {
    console.log("reducing count");
    if (req.session.user) {
      const product = await productModel.findById(req.body.product);
      const currentItem = await cartModel.aggregate([
        {
          $match: {
            customer: new mongoose.Types.ObjectId(req.session.user._id),
          },
        },
        {
          $unwind: "$products",
        },
        {
          $match: {
            "products.name": product._id,
          },
        },
      ]);

      const totalQtyPerItem = currentItem[0].products.quantity;
      console.log(totalQtyPerItem);
      if (totalQtyPerItem > 1) {
        const count = await cartModel.findOneAndUpdate(
          {
            _id: currentItem[0]._id,
            products: {
              $elemMatch: { name: new mongoose.Types.ObjectId(req.body.product) },
            },
          },
          {
            $inc: {
              "products.$.quantity": -1,
              totalPrice: -product.price,
              "products.$.price": -product.price,
              totalQuantity: -1,
            },
          }
        );

        const userCart = await cartModel.findOne({
          customer: req.session.user._id,
        });
        res.json({
          userCart,
          removedProduct: false,
        }
        );
      }
      if (totalQtyPerItem == 1) {
        await cartModel.findOneAndUpdate(
          {
            _id: currentItem[0]._id,
            products: {
              $elemMatch: { name: new mongoose.Types.ObjectId(req.body.product) },
            },
          },

          {
            $inc: {
              "products.$.quantity": -1,
              totalPrice: -product.price,
              "products.$.price": -product.price,
              totalQuantity: -1,
            },
          },

        )

        await cartModel.updateOne({
          _id: currentItem[0]._id,
        },
          {
            $pull: {
              products: {
                name: req.body.product
              }
            }
          }
        )


        const userCart = await cartModel.findOne({
          customer: req.session.user._id,
        });
        res.json({
          userCart,
          removedProduct: true,
        }
        );
      }



    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const addCount = async (req, res) => {
  try {
    console.log("adding count");
    if (req.session.user) {
      const product = await productModel.findById(req.body.product)
      const count = await cartModel.findOneAndUpdate(
        {
          customer: req.session.user._id,
          products: {
            $elemMatch: { name: req.body.product }
          },

        }
        , {
          $inc: {
            "products.$.quantity": 1,
            "products.$.price": product.discountPrice,
            totalPrice: product.price,
            totalQuantity: 1,
          }

        }
      )
      const userCart = await cartModel.findOne({
        customer: req.session.user._id,
      });

      res.json({
        userCart
      })
    }
    else {
      console.log("Need to login first");
      res.redirect('/')
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const removeProducts = async (req, res) => {
  try {
    if (req.session.user) {
      let productFromCart = await cartModel.aggregate([
        {
          $match: {
            customer: new mongoose.Types.ObjectId(req.session.user._id),
          },
        },
        {
          $unwind: "$products",
        },
        {
          $match: {
            "products.name": new mongoose.Types.ObjectId(req.body.id),
          },
        },
      ]);
      const cartID = productFromCart[0]._id;
      productFromCart = productFromCart[0].products;
      await cartModel.findByIdAndUpdate(cartID, {
        $pull: {
          products: {
            name: req.body.id,
          },
        },
        $inc: {
          totalPrice: -productFromCart.price,
          totalQuantity: -productFromCart.quantity,
        },
      });
      res.json({
        success: "removed",
      });
    }
    else {
      console.log("Need to login first");
      res.redirect('/')
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const applyCoupon = async (req, res) => {
  try {
    let userData = req.session.user
    let discountCode = req.body.code
    let userDetails = await cartModel.findOne({ customer: userData._id })
    let totalAmount = userDetails.totalPrice;
    let couponCode = await couponModel.findOne({ code: discountCode })
    if (totalAmount > 0) {
      if (couponCode) {
        let endDate = Date.parse(couponCode.expiryDate)
        let startDate = Date.parse(couponCode.startingDate)
        let todayDate = new Date()
        // todayDate = todayDate.toLocaleDateString("en-US")
        todayDate = Date.parse(todayDate)
        if (startDate <= endDate && todayDate <= endDate && couponCode.active == true && couponCode.totalCount>0) {
          response.totalAmount = totalAmount;
          response.discount = couponCode.discount;
          res.json({ response })
        }
        else {
          res.json({ expiry: true })
        }
      }
      else {
        res.json({ noCoupon: true })
      }
    }
    else {
      res.json({ amountLow: true })
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const proceedToPayment = async (req, res) => {
  try {
   
    let discountAmount = req.body.discountAmount;
    let couponCode = req.body.couponCode.toUpperCase();
    let cartCount = null;
    let wishlistCount = null;
    let cart = 0;
    let wishlist = 0;
    let userData = req.session.user;
    if (req.session.userLoggedIn) {
      cartCount = await cartModel.findOne({ customer: userData._id })
      cart = cartCount.totalQuantity;
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
    let totalAmount=await cartModel.find({customer:userData._id})
   let  totalPrice=totalAmount[0].totalPrice - discountAmount;
   res.send({ discountAmount, couponCode })
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

module.exports = { addToCart, showCart, reduceCount, addCount, removeProducts, applyCoupon, proceedToPayment }