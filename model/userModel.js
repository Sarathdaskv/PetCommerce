const mongoose = require('mongoose')

const adminUserData = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: "default_userPhoto.jpg",
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  ban: {
    type: Boolean,
    default: false,
  },
  addresses: [
    {
      building: String,
      mobileNumber: String,
      pinCode: Number,
      address: String,
      city: String,
      state: String,
      alterMobile: Number,
      primary: Boolean,
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
  couponsUsed: [
    {
      type: mongoose.Types.ObjectId,
      ref: "coupons",
    },
  ],
},

  {
    timestamps: true,
  }
)

const userData = new mongoose.model("signupUserDetails", adminUserData);

module.exports = userData;