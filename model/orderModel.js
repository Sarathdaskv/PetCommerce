const mongoose = require("mongoose");

const orderShema = mongoose.Schema({
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "signupUserDetails",
  },
  totalQuantity: Number,
  summary: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "productDetails",
      },
      quantity: Number,
      totalPrice: Number,
    },
  ], 
  shippingAddress: {
    building: String,
    address: String,
    pinCode: Number,
    city: String,
    mobileNumber: Number,
  },
  delivered: { type: Boolean, default: false },
  status: {
    type: String,
    default: "In-transit",
  },
  modeOfPayment: String,
  couponUsed: { type: mongoose.Types.ObjectId, ref: "Coupon" },
  price: Number,
  finalPrice: Number,
  discountPrice: { type: Number, default: 0 },
  orderedOn: { type: Date, default: Date.now() },
  deliveredOn: { type: Date, default: null },
});

const orderModel = mongoose.model("Orders", orderShema);
module.exports = orderModel;
