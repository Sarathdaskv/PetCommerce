const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "signupUserDetails",
      },
      totalPrice: Number,
      totalQuantity: Number,
      totalAfterDiscount: Number,
      products: [
        {
          name: {
            type: mongoose.Types.ObjectId,
            ref: "productDetails",
          },
          quantity: { type: Number, default: 1, min: 1 },
          price: Number,
        },
      ],
})

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;
