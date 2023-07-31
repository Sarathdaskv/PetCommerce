const couponModel = require('../model/couponModel')
const moment = require('moment')

const viewCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find();
        res.render("admin/coupons", {
            session: req.session.admin,
            documentTitle: "Coupon Management",
            coupons,
            moment,
        });
    }
    catch (err) {
        console.log(err);
        res.redirrect('/admin/dashboard')
    }
}

const addNew = async (req, res) => {
    try {
        const newCoupon = new couponModel({
            name: req.body.name,
            code: req.body.code.toUpperCase(),
            discount: req.body.discount,
            startingDate: req.body.startingDate,
            expiryDate: req.body.expiryDate,
            totalCount: req.body.totalCount
        });
        await newCoupon.save();
        res.redirect("/admin/couponManagement");
    } catch (error) {
        console.log("Error adding new coupon: " + error);
        res.redirrect('/admin/dashboard')
    }
};


const changeActivity = async (req, res) => {
    try {
      const currentCoupon = await couponModel.findById(req.query.id);
      let currentActivity = currentCoupon.active;
      if (currentActivity == true) {
        currentActivity = false;
      } else {
        currentActivity = true;
      }
      currentActivity = Boolean(currentActivity);
      await couponModel.findByIdAndUpdate(currentCoupon._id, {
        $set: { active: currentActivity },
      });
      res.redirect("/admin/couponManagement");
    } catch (error) {
      console.log("Error changing coupon activity: " + error);
      res.redirrect('/admin/dashboard')
    }
  };
  



module.exports = { viewCoupons, addNew,changeActivity }