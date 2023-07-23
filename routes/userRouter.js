const express=require('express');
const userHomePageController=require('../controller/userHomePageController')
const userProductController=require('../controller/userProductController')
const userCartController=require('../controller/userCartController')
const userWishListController=require('../controller/userWishListController')
const userProfileController=require('../controller/userProfileController')
const userSession=require('../middleware/userSession')
const router=express.Router();


router
.route('/')
.get(userHomePageController.landingPage)


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
.post(userSession.userLoginSession,userHomePageController.otpVerfication)


router
.route('/resendOtp')   
.get(userSession.userLoginSession,userHomePageController.resendOtp) 

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

router
.route('/searchProducts')
.put(userProductController.searchProducts)  

router.route('/product/showDetail')
.get(userProductController.showProductDetails) 

router.route('/cart')  
.get(userCartController.showCart)
.delete(userCartController.removeProducts) 


router
.route('/product/addToCart')
.post(userCartController.addToCart)   

router
.route('/cart/changeProductQuanity')
.put(userCartController.addCount)
.delete(userCartController.reduceCount) 
 

router
.route('/wishlist')
.get(userSession.userLoginSession,userWishListController.showWishlistPage)
.post(userSession.userLoginSession,userWishListController.addToWishList)
.delete(userSession.userLoginSession,userWishListController.removeProduct)

router
.route('/userProfile')
.get(userSession.userLoginSession,userProfileController.showProfilePage)




module.exports=router;  