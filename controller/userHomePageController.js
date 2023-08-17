const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
const cartModel = require('../model/cartModel')
const productModel = require('../model/productModel')
const wishlistModel = require('../model/wishlistModel')
const bannerModel = require('../model/banerModel')
const categoryModel = require('../model/categoryModel')
const { default: mongoose } = require('mongoose');

let OTP = `${Math.floor(10000 + Math.random() * 90000)}`;
const sendVerifyMail = async (name, email) => {
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
    subject: "For Verification Mail",
    html: `<p> Hi, ` + name + ` , Welcome to <h1>PetCommerce</h1>. Your OTP for Verification is <h3>${OTP}</h3> </p>`
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

const signUpPage = async (req, res) => {
  try {
    res.render('user/userSignUpPage', { errMsg: false, userData: 0 })
  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const registerUserDetails = async (req, res) => {
  req.session.userDetails = req.body
  try {
    const userExists = await userModel.findOne({ email: req.body.email })
    if (userExists) {
      res.render('user/userSignUpPage', { errMsg: 'User email already exists', userData: 0 })
    }
    else {
      sendVerifyMail(req.body.name, req.body.email)
      req.session.currentTime = Date.now();
      req.session.targetTime = Date.now() + 30000;
      req.session.otp = OTP;
      console.log("old-", req.session.otp);

      res.render('user/otpVerification', { userId: 0, errMsg: false })
    }
  }
  catch (error) {
    console.log(error);
  }
}


const otpVerfication = async (req, res) => {
  const { name, userName, email, password, phoneNumber } = req.session.userDetails
  try {
    const currentTime = Date.now()
    if (req.session.targetTime >= currentTime) {
      if (req.session.otp === req.body.otp) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({
          name: name,
          userName: userName,
          email: email,
          phoneNumber: phoneNumber,
          password: hashedPassword,

        })
        
        req.session.user = user;
        await userModel.insertMany([user])
        res.render('user/userLoginPage', { userData: 0, errMsg: false })

        const newCart = await cartModel({
          customer: new mongoose.Types.ObjectId(user._id),
        });
        await userModel.findByIdAndUpdate(user._id, {
          $set: { cart: new mongoose.Types.ObjectId(newCart._id) },
        });
        await newCart.save();
        const newWishlist = await wishlistModel({
          customer: new mongoose.Types.ObjectId(user._id),
        });
        await userModel.findByIdAndUpdate(user._id, {
          $set: { wishlist: new mongoose.Types.ObjectId(newWishlist._id) },
        });
        await newWishlist.save();
        console.log("cart and whislist created");
      }
      else {
        res.render('user/otpVerification', { userId: 0, errMsg: 'invalid OTP,kindly wait' })
      }
    }
    else {
      res.render('user/otpVerification', { userId: 0, errMsg: 'OTP timed out,kindly wait' })
    }

  }
  catch (err) {
    console.log(err);
  }
}

const resendOtp = async (req, res) => {
  try {
    const { name, email } = req.session.userDetails
    sendVerifyMail(name, email)
    OTP = `${Math.floor(10000 + Math.random() * 90000)}`;
    req.session.currentTime = Date.now();
    req.session.targetTime = Date.now() + 30000;
    req.session.otp = OTP;
    console.log("new-", req.session.otp);
    res.render('user/otpVerification', { userId: 0, errMsg: false })

  }
  catch (err) {
    console.log(err);
  }
}

const showLoginPage = async (req, res) => {
  res.render('user/userLoginPage', { userData: 0, errMsg: false })
}

const userLogin = async (req, res) => {
  try {
    let hashedPassword;
    const checkUser = await userModel.findOne({ email: req.body.email });
    if(checkUser){
     hashedPassword = await bcrypt.compare(req.body.password, checkUser.password);
    }
    if (checkUser && hashedPassword) {
      if (checkUser.ban) {
        res.render('user/userLoginPage', { userData: 0, errMsg: 'Sorry you are banned' })
      }
      else {
        req.session.userLoggedIn = true;
        req.session.user = checkUser; 
        res.redirect('/'); 
      } 
    } 
    else {  
      res.render('user/userLoginPage', { userData: 0, errMsg: 'invalid credentials' })
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/userLogin')
  }

}

const forgotPassword = async (req, res) => {
  try {
    res.render('user/forgotPassword', { userData: 0, mail: true, errMsg: 0 })
  }
  catch (err) {
    console.log(err);
    res.redirect('/userLogin');
  }
}
const sendForgotPasswordOtp = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      req.session.invalidEmail = true
      res.redirect('/getForgotPasswordOtp')
    }
    else {
      req.session.userDetails = user;
      sendVerifyMail("User", req.body.email);
      req.session.forgotPasswordTargetTime = Date.now() + 30000;
      req.session.forgotOtp = OTP;
      console.log("forgotPasswordOtp-", req.session.forgotOtp);
      req.session.otpPage = true;
      res.redirect('/getForgotPasswordOtp')
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/userLogin');
  }
}
const getForgotPasswordOtp = async (req, res) => {
  try {
    if (req.session.invalidEmail) {
      req.session.invalidEmail = false;
      res.render('user/forgotPassword', { userData: 0, mail: true, errMsg: 'User email not found,kindly signup' })
    }
    else if (req.session.otpPage) {
      req.session.otpPage = false;
      res.render('user/forgotPassword', { userData: 0, otpPage: true, errMsg: 0 })
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/userLogin')
  }
}
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    let forgotPasswordCurrentTime = Date.now();
    if (req.session.forgotPasswordTargetTime >= forgotPasswordCurrentTime) {
      if (req.session.forgotOtp == req.body.otp) {
        res.render('user/forgotPassword', { userData: 0, changePassword: true, errMsg: 0 })
      }
      else {
        res.render('user/forgotPassword', { userData: 0, otpPage: true, errMsg: 'invalid OTP' })
      }
    }
    else {
      res.render('user/forgotPassword', { userData: 0, otpPage: true, errMsg: 'OTP expired,kindly wait' })
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('/userLogin')
  }
}
const resendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.session.userDetails
    sendVerifyMail("User", email)
    OTP = `${Math.floor(10000 + Math.random() * 90000)}`;
    req.session.forgotOtp = OTP;
    req.session.forgotPasswordTargetTime = Date.now() + 30000;
    console.log("new-ForgotPasswordOTP", req.session.forgotOtp);
    res.render('user/forgotPassword', { userData: 0, otpPage: true, errMsg: 0 })
  }
  catch (err) {
    console.log(err);
    res.redirect('/userLogin')
  }

}
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.session.userDetails;
    const user = await userModel.findOne({ email });
    console.log(user);
    const newhashedPassword = await bcrypt.hash(req.body.password, 10);
    await userModel.updateOne({ _id: user._id },
      {
        $set:
        {
          password: newhashedPassword
        }
      }
    )
    res.redirect('/userLogin')
  }
  catch (err) {
    console.log(err);
    res.redirect('/userLogin')
  }

}

const landingPage = async (req, res) => {
  try {

    let userData = req.session.user
    let cartCount = null;
    let wishlistCount = null;
    let cart=0;
      let wishlist = 0;
    if (req.session.userLoggedIn) {
      cartCount = await cartModel.find({customer:userData._id})
        cart=cartCount[0].totalQuantity;
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
    const banner = await bannerModel.find({ active: true });
    const categoryList = await categoryModel.find();
    const productList = await productModel.find({ listed: true });
    res.render('user/homePage', {
      userData,
      SliderImage: banner,
      category: categoryList,
      featuredProducts: productList,
      cartCount:cart,
      wishlistCount:wishlist
    })

  }
  catch (err) {
    console.log(err);
    res.redirect('/')
  }
}

const doLogOut=async(req,res)=>{
  req.session.destroy((err)=> {
    if (err) {
        console.log("Error");
        res.send("Error")
    } else {
        res.redirect('/')
    }
})
}

module.exports = {
  signUpPage,
  otpVerfication,
  registerUserDetails,
  resendOtp,
  userLogin,
  showLoginPage,
  forgotPassword,
  sendForgotPasswordOtp,
  getForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resendForgotPasswordOtp,
  resetPassword,
  landingPage,
  doLogOut
} 