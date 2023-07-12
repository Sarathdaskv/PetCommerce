const adminLoginModel = require('../model/adminModel')

const bcrypt = require('bcrypt')


const loginPage = async (req, res) => {
    res.render('admin/adminLogin', { documentTitle: "Admin Sign In" })
}

const verification = async (req, res) => {
    try {
        
        const adminUser = await adminLoginModel.findOne({ email:req.body.email })
        console.log(adminUser);
        if (adminUser) {
            const hashedPassword = await bcrypt.compare(req.body.password, adminUser.password);
            if (hashedPassword) {
                req.session.admin = req.body.email;
                console.log("Admin session created.");
                res.redirect("/admin/dashboard");
            }
            else {
                res.render('admin/adminLogin', { documentTitle: "Admin Sign In" ,errorMessage:"incorrect password"})
            }
        }
        else {
            res.render('admin/adminLogin', { documentTitle: "Admin Sign In" ,errorMessage:"invalid credentials "})
        }

    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/login');
    }
}

module.exports = {
    loginPage, verification
}