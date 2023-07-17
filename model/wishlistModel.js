const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "signupUserDetails",
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "productDetails",
    },
  ],
});

const wishlistModel = mongoose.model("Wishlist", wishlistSchema);
module.exports = wishlistModel;
