const express=require('express');
const userHomePageController=require('../controller/userHomePageController')
const router=express.Router();



router
.route('/userLogin') 
.get(userHomePageController.showLoginPage)
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
.route('/')
.get(userHomePageController.landingPage)

module.exports=router; 