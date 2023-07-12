const view=async(req,res)=>{
    res.render('admin/dashboard',{orderCount:15,customerCount:5,productCount:10,totalRevenue:25000})
} 

module.exports={view } 