const userLoginSession = async (req, res,next) => {
    let userData = req.session.user;
    if (req.session.userLoggedIn) {
        next()
    }
    else {
        res.render('user/userLoginPage', { userData, errMsg: false })
    }
}


const userSignupSession = (req,res,next)=>{    
    let userData = req.session.user
    if(req.session.userLoggedIn){
        next()
    }else{
        res.render('user/userSignUpPage', { errMsg: false, userData })
    }
}

module.exports={userLoginSession,userSignupSession}