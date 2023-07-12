const userModel = require('../model/userModel')

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        res.render('admin/customer', { allCustomers: users, documentTitle: "Customer Management" ,session: req.session.admin})
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/login')
    }
} 
const updateBan = async (req, res) => {
    try{
        let currentAccess = req.body.Ban === "true";
    currentAccess = !currentAccess
    await userModel.updateOne({
        _id:req.body.userId
    },{
       $set:{
        ban:currentAccess
       }
    })
    res.json({
        data: { newAccess: currentAccess }
      });
    }
    catch(err){
        console.log(err);
        res.redirect('/admin/login')
    }
}

module.exports = { getAllUsers, updateBan } 