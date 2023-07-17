const categoryModel = require('../model/categoryModel')


const addToCart = async (req, res) => {
    try {
        
        res.send({
           status: true
        })
    }
    catch (err) {
console.log(err);
res.redirect('/')
    }
}

const showCart =async(req,res)=>{
    try{
        let cartCount=null;
        let wishlistCount=null;
        let userData = req.session.user
        if (req.session.userLoggedIn) {
            cartCount = await cartModel.findById(req.session.user._id)
            wishlistCount = await wishlistModel.findById(req.session.user._id)
        }
        
    }
    catch(err){
        console.log(err);
        res.redirect('/')
    }
}

module.exports={addToCart,showCart}