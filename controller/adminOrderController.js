const orderModel = require('../model/orderModel')
const productModel = require('../model/productModel')
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
        status: "Delivered",
        delivered: true,
        deliveredOn: Date.now(),
      },
    });


    let orderedProductList = await orderModel.findOne({ _id: req.body.orderID })

    orderedProductList.summary.forEach(async element => {
      await productModel.findOneAndUpdate({
        _id: element.product
      },
        {
          $inc: {
            "inventory": -element.quantity
          }
        }
      )
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

const returnOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderID, {
      $set: {
        status: "Returned",
      },
    });

    let orderedProductList = await orderModel.findOne({ _id: req.body.orderID })

    orderedProductList.summary.forEach(async element => {
      await productModel.findOneAndUpdate({
        _id: element.product
      },
        {
          $inc: {
            "inventory": element.quantity
          }
        }
      )
    });

    res.json({
      data: { returned: 1 },
    });
  }
  catch (err) {
    console.log(err);
    res.redirect('/dashboard')
  }
}

const cancelOrder = async (req, res) => {
  try {
    let orderId = req.body.orderId;
    console.log("ewffer ", orderId);
    await orderModel.updateOne({
      _id: orderId
    }, {
      $set: {
        status: "Cancelled"
      }
    }
    )
    res.send({data:"Cancelled"})
  }
  catch (err) {
    console.log(err);
    res.redirect('/dashboard')
  }
}

module.exports = { viewAllOrders, orderDetails, deliverOrder, returnOrder, cancelOrder }