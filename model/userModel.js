const mongoose=require('mongoose')

const adminUserData= new mongoose.Schema({
    name:{
        type:String,    
        required:true
    }, 
    userName:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    ban:{ 
        type: Boolean,
        default: false,
      },
      address:{
        type:Array,
        default:[],
        
      },
      wishlist:[{type:mongoose.Schema.Types.ObjectId, ref:"Wishlist"}],
      cart:[{type:mongoose.Schema.Types.ObjectId, ref:"Cart"}],
      orders:[{type:mongoose.Schema.Types.ObjectId, ref:"Orders"}],
    },
      {
        timestamps:true,
      }
)

const userData=new mongoose.model("signupUserDetails",adminUserData);

module.exports=userData;