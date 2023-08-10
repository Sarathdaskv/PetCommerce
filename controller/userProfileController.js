const cartModel = require('../model/cartModel')
const wishlistModel = require('../model/wishlistModel')
const userModel = require('../model/userModel')
const categoryModel = require('../model/categoryModel')
const bcrypt = require('bcrypt')
const sharp = require('sharp')

const { default: mongoose } = require('mongoose')
const userData = require('../model/userModel')

const addAddress = async (req, res) => {
    try {

        let userData = req.session.user
        let user = await userModel.findOne({ _id: userData._id })
        if (user) {
            await userModel.updateOne({
                _id: userData._id
            },
                {
                    $push: {
                        addresses: {
                            building: req.body.building,
                            mobileNumber: req.body.mobileNumber,
                            pinCode: req.body.pinCode,
                            address: req.body.address,
                            city: req.body.city,
                            state: req.body.state,
                            alterMobile: req.body.alterMobile,
                            primary: true,
                        }
                    }
                }
            )
        }
        res.redirect('/userProfile')
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const addressEditPage = async (req, res) => {
    try {
        let addressID = req.query.addressID
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

        let getAddressDetails = await userModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userData._id) },
            },
            {
                $unwind: '$addresses'
            },
            {
                $match: {
                    "addresses._id": new mongoose.Types.ObjectId(addressID)
                }
            }

        ])
        console.log(getAddressDetails);

        res.render('user/updateBillingAddress', { userData, cartCount: cart, address: getAddressDetails, category, addressID, wishlistCount: wishlist })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}


const updateAddress = async (req, res) => {
    try {
        console.log(req.body);
        let userData = req.session.user
        let addressID = req.body.addressID
        let userDetails = await userModel.updateOne({
            _id: userData._id,
            addresses: {
                $elemMatch: { _id: new mongoose.Types.ObjectId(addressID) },
            },
        },
            {
                $set: {

                    "addresses.$.building": req.body.building,
                    "addresses.$.mobileNumber": req.body.mobileNumber,
                    "addresses.$.pinCode": req.body.pinCode,
                    "addresses.$.address": req.body.address,
                    "addresses.$.city": req.body.city,
                    "addresses.$.state": req.body.state,
                    "addresses.$.alterMobile": req.body.alterMobile,
                }
            }
        )

        res.redirect('/userProfile')
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}


const showProfilePage = async (req, res) => {
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
        let userDetails = await userModel.findOne({ _id: userData._id })
        let category = await categoryModel.find()
        res.render('user/userProfile', { category, userData, cartCount: cart, userDetails, wishlistCount: wishlist })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const updateProfile = async (req, res) => {
    try {
        let userData = req.session.user;
        const updatedData = await userModel.updateOne(
            {
                _id: userData._id
            },
            {
                $set: {
                    name: req.body.name,
                    userName: req.body.userName
                }

            }
        )
        res.send("success")
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const updateEmailPhone = async (req, res) => {
    try {
        let userData = req.session.user;
        const updatedData = await userModel.updateOne(
            {
                _id: userData._id
            },
            {
                $set: {
                    phoneNumber: req.body.phoneNumber.trim(),
                    email: req.body.email.trim()
                }
            }
        )
        res.send("success")
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }

}

const updatePassword = async (req, res) => {
    try {
        let userData = req.session.user;
        const newhashedPassword = await bcrypt.hash(req.body.profilePassword, 10);
        await userModel.updateOne({ _id: userData._id },
            {
                $set:
                {
                    password: newhashedPassword
                }
            }
        )
        res.send("success")
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const showAddress = async (req, res) => {
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
        let addressList = await userModel.find(
            {
                _id: userData._id,

            }, {
            _id: 0,
            addresses: 1
        }
        )
        res.json({ addressList })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const getAddressPage = async (req, res) => {
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
        res.render('user/billingAddress', { category, userData, cartCount: cart, wishlistCount: wishlist })
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const deleteAddress = async (req, res) => {
    try {
        let addressID = req.body.addressID
        let userData = req.session.user
        let user = await userModel.findOne({ _id: userData._id })
        if (user) {
            await userModel.updateOne({
                _id: userData._id
            },
                {
                    $pull: {
                        addresses: {
                            _id: addressID
                        }
                    }
                }

            )
        }
        res.send("deleted")
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

const updateUserImage = async (req, res) => {
    try {
        let userId = req.session.user._id;
        let newName = req.body.userName;
        if (req.file) {
            await userModel.updateOne(
                {
                    _id:userId
                },{
                    $set:{
                        photo:`${req.file.filename}`
                    }
                }
            )
            res.redirect('/userProfile')
        } else {
            res.status(400).send("Please upload a valid image");
        }
       console.log("hgrsth",req.file);
       console.log("name",newName);
    }
    catch (err) {
        console.log(err);
        res.redirect('/')
    }
}


module.exports = {
    showProfilePage,
    updateProfile,
    updateEmailPhone,
    updatePassword,
    showAddress,
    getAddressPage,
    addAddress,
    addressEditPage,
    updateAddress,
    deleteAddress,
    updateUserImage
}