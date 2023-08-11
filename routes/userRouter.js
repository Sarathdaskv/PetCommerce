const express=require('express');
const userHomePageController=require('../controller/userHomePageController')
const userProductController=require('../controller/userProductController')
const userCartController=require('../controller/userCartController')
const userWishListController=require('../controller/userWishListController')
const userProfileController=require('../controller/userProfileController')
const userOrderController=require('../controller/userOrderController')
const userSession=require('../middleware/userSession')
const croppedImgUpload=require('../utilities/cropImage')
const router=express.Router();


router
.route('/')
.get(userHomePageController.landingPage)


router
.route('/userLogin') 
.get(userHomePageController.showLoginPage) 
.post(userHomePageController.userLogin) 

router
.route('/logOut')
.get(userHomePageController.doLogOut) 

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
.post(userProductController.sortBy)

router
.route('/searchProducts')
.put(userProductController.searchProducts)   

router
.route('/searchHomeProducts') 
.get(userProductController.searchHomeProducts)

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
.route('/cart/applyCoupon')      
.post(userSession.userLoginSession,userCartController.applyCoupon)
 
router
.route('/cart/proceedToPayment') 
.post(userSession.userLoginSession,userCartController.proceedToPayment)

router
.route('/placeOrder')
.get(userSession.userLoginSession,userOrderController.placeOrderPage)
.post(userSession.userLoginSession,userOrderController.placeOrder)

router
.route('/orderSuccess')
.get(userSession.userLoginSession,userOrderController.orderSuccess)

router  
.route('/verifyPayment')
.post(userSession.userLoginSession,userOrderController.verifyPayment)

router
.route('/orders')    
.get(userSession.userLoginSession,userOrderController.viewOrders)

router
.route('/orders/cancel')
.post(userSession.userLoginSession,userOrderController.cancelOrders)

  
router
.route('/orders/return') 
.post(userSession.userLoginSession,userOrderController.getOrderProductDetails)
 
router
.route('/orders/return/submit')
.post(userSession.userLoginSession,userOrderController.submitReturnOrders)


router
.route('/orders/viewOrderDetails')
.post(userSession.userLoginSession,userOrderController.getOrderProductDetails)

router
.route('/orders/printOrder/:id')
.get(userSession.userLoginSession,userOrderController.getPrintDetails)

 
router
.route('/wishlist')
.get(userSession.userLoginSession,userWishListController.showWishlistPage)
.post(userSession.userLoginSession,userWishListController.addToWishList)
.delete(userSession.userLoginSession,userWishListController.removeProduct)

router  
.route('/userProfile')    
.get(userSession.userLoginSession,userProfileController.showProfilePage) 
.post(userSession.userLoginSession,croppedImgUpload.single("photo"),userProfileController.updateUserImage)

router 
.route('/userProfile/profile/update')
.put(userSession.userLoginSession,userProfileController.updateProfile) 

router 
.route('/userProfile/email/update') 
.put(userSession.userLoginSession,userProfileController.updateEmailPhone)

 
router    
.route('/userProfile/password/update') 
.put(userSession.userLoginSession,userProfileController.updatePassword)       

router
.route('/addressPage')
.get(userSession.userLoginSession,userProfileController.getAddressPage)
.post(userSession.userLoginSession,userProfileController.addAddress)

router
.route('/userProfile/address') 
.get(userSession.userLoginSession,userProfileController.showAddress) 

router
.route('/userProfile/addressEditPage')
.get(userSession.userLoginSession,userProfileController.addressEditPage) 

router 
.route('/userProfile/address/update')
.post(userSession.userLoginSession,userProfileController.updateAddress) 

router
.route('/userProfile/addressDelete')
.delete(userSession.userLoginSession,userProfileController.deleteAddress)



module.exports=router;  