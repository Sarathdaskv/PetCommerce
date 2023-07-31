const orderModel = require('../model/orderModel')

const moment = require('moment')


const viewAllOrders = async (req, res) => {

  try {

    const allOrders = await orderModel
      .find()
      .populate("customer", "name email")
      .populate("couponUsed", "name")
      .populate("summary.product", "category name brand price")
     
    console.log(allOrders);
    res.render("admin/orders", {
      allOrders,
      documentTitle: "Orders ",
      moment,
      session: req.session.admin,
    });

  }
  catch (err) {
    console.log(err);
    res.redirect('/dashboard')
  }
}


const orderDetails = async (req, res) => {
  try {
    const currentOrder = await orderModel
      .findById(req.params.id)
      .populate("summary.product")
      .populate("couponUsed");
    res.render("admin/orderDetails", {
      session: req.session.admin,
      currentOrder,
      moment,
      documentTitle: "Order Details | PetCommerce",
    });
  }
  catch (err) {
    console.log(err);
    res.redirect('/dashboard')
  }
}

const deliverOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderID, {
      $set: {
        status:"Delivered",
        delivered: true,
        deliveredOn: Date.now(),
      },
    });
    res.json({
      data: { delivered: 1 },
    });
  }
  catch (err) {
    console.log(err);
    res.redirect('/dashboard')
  }
}

module.exports = { viewAllOrders, orderDetails, deliverOrder }