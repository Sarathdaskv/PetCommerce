const nodemailer = require("nodemailer")
const categoryModel = require('../model/categoryModel')
const couponModel = require('../model/couponModel')
const userModel = require('../model/userModel')
const cartModel = require('../model/cartModel');
const wishlistModel = require('../model/wishlistModel');
const { default: mongoose } = require('mongoose');
const orderModel = require('../model/orderModel');
const moment = require('moment')

const placeOrderPage = async (req, res) => {
    try {
        let discountAmount = req.query.discountAmount;
        let couponCode = req.query.couponCode;
        let userData = req.session.user
        let cartCount = null;
        let wishlistCount = null;
        let totalAmount = await cartModel.find({ customer: userData._id })
        totalAmount = totalAmount[0].totalPrice;
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
        let category = await categoryModel.find();
        let addressList = await userModel.findOne(
            {
                _id: userData._id,

            }, {
            _id: 0,
            addresses: 1
        }
        )

        let cartProducts = await cartModel.findOne({ customer: userData._id }).populate("products.name")


        res.render('user/placeOrder', { category, userData, cartCount: cart, addressList, cartProducts, totalAmount, discountAmount, couponCode, wishlistCount: wishlist })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const placeOrder = async (req, res) => {
    try {
        console.log("available post data", req.body);
        if (req.body.address == undefined) {
            return res.json({ noAddress: true })
        }
        let totalAmount = await cartModel.find({ customer: req.body.userID })
        totalAmount = totalAmount[0].totalPrice;
        let finalPrice = totalAmount - req.body.discountAmount;
        let coupon = req.body.coupon;
        let discountAmount = req.body.discountAmount;
        let shippingAddress = await userModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.body.userID)
                }
            },
            {
                $unwind: "$addresses"
            },
            {
                $match: {
                    "addresses._id": new mongoose.Types.ObjectId(req.body.address)
                }
            }
        ])


        shippingAddress = shippingAddress[0].addresses;


        const userCart = await cartModel.findOne({
            customer: req.session.user._id,
        });


        let orderSummary = await cartModel.aggregate([
            {
                $match: {
                    customer: new mongoose.Types.ObjectId(req.body.userID)
                }
            },
            {
                $unwind: "$products"
            },
            {
                $project: {
                    _id: 0,
                    product: "$products.name",
                    quantity: "$products.quantity",
                    totalPrice: "$products.price"
                }
            }
        ])
        // console.log(orderSummary);
        let couponUsed = await couponModel.findOne({ code: req.body.coupon, active: true })
        let couponId;

        if (couponUsed) {
            couponId = couponUsed._id
            await couponModel.findByIdAndUpdate(couponUsed._id, {
                $inc: {
                    totalCount: -1
                }
            })
        }
        else {
            couponId = null;
        }
        req.session.couponUsed = couponUsed;

        orderDetails = {
            customer: req.body.userID,
            shippingAddress: {
                building: shippingAddress.building,
                address: shippingAddress.address,
                pincode: shippingAddress.pinCode,
                city: shippingAddress.city,
                MobileNumber: shippingAddress.mobileNumber,
            },
            modeOfPayment: req.body.paymentMethod,
            couponUsed: couponId,
            summary: orderSummary,
            totalQuantity: userCart.totalQuantity,
            price: userCart.totalPrice,
            finalPrice: finalPrice,
            discountPrice: discountAmount,
        }
        //  console.log(orderDetails);

        req.session.orderDetails = orderDetails;

        const transactionID = Math.floor(
            Math.random() * (1000000000000 - 10000000000) + 10000000000
        );
        req.session.transactionID = transactionID;

        if (req.session.transactionID) {
            const couponUsed = req.session.couponUsed;
            req.session.transactionID = false;
            const orderDetails = new orderModel(req.session.orderDetails);
            orderDetails.save();
            if (couponUsed) {
                await userModel.findByIdAndUpdate(req.session.user._id, {
                    $push: {
                        orders: [new mongoose.Types.ObjectId(orderDetails)],
                        couponsUsed: [couponUsed],
                    },
                });
            } else {
                await userModel.findByIdAndUpdate(req.session.user._id, {
                    $push: {
                        orders: [new mongoose.Types.ObjectId(orderDetails)],
                    },
                });
            }
            await cartModel.findOneAndUpdate(
                {
                    customer: req.session.user._id,
                },
                {
                    $set: { products: [], totalPrice: 0, totalQuantity: 0 },
                }
            );


            if (req.body.paymentMethod == 'COD') {
                res.json({ codSuccess: true })
            }

        } else {
            res.redirect("/placeOrder");
        }
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }

}

const orderSuccess = async (req, res) => {
    try {
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
        let category = await categoryModel.find();

        //send order mail
        
        const sendVerifyMail = async (email) => {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: process.env.VERIFICATION_MAIL_ID,
                pass: process.env.VERIFICATION_MAIL_PASSWORD
              },
            });
          
            const mailOptions = {
              from: process.env.VERIFICATION_MAIL_ID,
              to: email,
              subject: "Order Confirmation Mail",
              html: `
              <div class="text-center mb-5 mt-4 d-flex flex-column justify-content-center">
              <h4>Your Order has been placed successfully <i class="fa fa-check"></i></h4>
              `
            };
          
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Error in sending email  ' + error);
                return true;
              } else {
                console.log('Email sent: ' + info.response);
                return false;
              }
            });
          
          }
          sendVerifyMail(userData.email)
        res.render('user/orderSuccess', { category, userData, cartCount: cart, wishlistCount: wishlist })
    }

    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const viewOrders = async (req, res) => {
    try {
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
        let category = await categoryModel.find();
        let orderedProductList = await orderModel.find({ customer: userData._id });
        let date = new Date();
        if (orderedProductList != "") {

            date.setDate(orderedProductList[0].orderedOn.getDate() + 7);
        }

        res.render('user/userOrder', { category, userData, cartCount: cart, productList: orderedProductList, wishlistCount: wishlist, expectedDeliveryDate: date })

    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const getOrderProductDetails = async (req, res) => {
    try {
        let orderId = req.body.orderId
        let orderedProducts = await orderModel.findById(orderId)
            .populate("summary.product")
            .populate("couponUsed")
        console.log(orderedProducts);
        res.json({ orderedProducts })

    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const cancelOrders = async (req, res) => {

    try {
        let orderId = req.body.orderId
        await orderModel.updateOne(
            {
                _id: orderId
            }, 
            {
            $set: {
                status: "Cancelled"
            }
        }
        )
        res.json("Cancelled")
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

module.exports = { placeOrderPage, placeOrder, orderSuccess, viewOrders, getOrderProductDetails, cancelOrders } 