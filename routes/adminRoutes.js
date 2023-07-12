const express=require('express');
const router=express.Router();
const adminController=require('../controller/adminController')
const adminCustomerManagement=require('../controller/adminCustomerManagement')
const category=require('../controller/adminCategoryController')
const products=require('../controller/adminProductController')
const adminSession=require('../middleware/adminSession')
const dashboard=require('../controller/adminDashboardController')
const banners=require('../controller/adminBannerController')
const upload=require('../utilities/ImageProcessor')

router
.route('/login')
.get(adminController.loginPage)
.post(adminController.verification)


// Dashboard
router
  .route('/dashboard')
  .get(adminSession, dashboard.view) 

  //customerManagement
router
.route('/customerManagement')
.get(adminSession,adminCustomerManagement.getAllUsers)
.patch(adminSession,adminCustomerManagement.updateBan)

//category
router
.route('/categories')  
.get(adminSession,category.listCategory)
.post(adminSession,category.addCategory)
             
//category edit 
router
.route('/categories/:id')    
.get(adminSession,category.editCategory)
.post(adminSession,category.saveCategory) 
.delete(adminSession,category.deleteCategory)


 
//products
router.route('/productManagement')
.get(adminSession,products.viewProducts)
.post(adminSession,
  upload.fields([
    {name:"frontImage", maxCount:1},
    {name:"thumbnail", maxCount:1},
    {name:"images", maxCount:3},
  ]), 
  products.addProducts)
 

  //product edit
  router.route('/productManagement/:id')
  .get(adminSession,products.editProducts)
  .post(adminSession,
    upload.fields([ 
      { name: "frontImage", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 3 },
    ]),
    products.saveEditProducts)

//change product listing
router 
.route('/productManagement/changeListing/:id')
.patch(adminSession,products.changeListing) 
   
//Banner
router.route('/bannerManagement')
.get(adminSession,banners.viewBanners) 
.post(adminSession, upload.single("bannerImage"), banners.addNewBanners)
.patch(adminSession,banners.changeBannerActivity)
.delete(adminSession,banners.deleteBanner)




module.exports=router;    

 