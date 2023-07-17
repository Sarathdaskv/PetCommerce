const express=require('express');
const userHomePageController=require('../controller/userHomePageController')
const userProductController=require('../controller/userProductController')
const userCartController=require('../controller/userCartController')
const userSession=require('../middleware/userSession')
const router=express.Router();


router
.route('/')
.get(userHomePageController.landingPage)


router
.route('/userLogin') 
.get(userSession.userLoginSession,userHomePageController.showLoginPage)
.post(userHomePageController.userLogin)
 
router 
.route('/signUp')
.get(userHomePageController.signUpPage)  

router
.route('/registerUser')
.post(userHomePageController.registerUserDetails) 

router
.route('/verifyOtp')
.post(userHomePageController.otpVerfication)


router
.route('/resendOtp')  
.get(userHomePageController.resendOtp) 

router 
.route('/forgotPass')
.get(userHomePageController.forgotPassword)

router
.route('/getForgotPasswordOtp')
.get(userHomePageController.getForgotPasswordOtp)

router
.route('/sendForgotOtp')
.post(userHomePageController.sendForgotPasswordOtp)

router
.route('/verifyForgotPasswordOtp')
.post(userHomePageController.verifyForgotPasswordOtp)

router
.route('/resendForgotPasswordOtp')
.get(userHomePageController.resendForgotPasswordOtp)

router
.route('/resetPassword')
.post(userHomePageController.resetPassword)

router
.route('/shop')
.get(userProductController.getCategoryProducts)

router
.route('/shop/products')
.get(userProductController.showAllProducts)

router
.route('/products/filter')
.post(userProductController.filteredProducts)

router
.route('/showProducts')
.get(userProductController.viewMore)

router.route('/product/showDetail')
.get(userProductController.showProductDetails)


router.route('/cart')
.get(userSession.userLoginSession,userCartController.showCart)

router
.route('/product/addToCart')
.post(userSession.userLoginSession,userCartController.addToCart)

module.exports=router; 