module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = res.session.returnTo
    }
    next()
}
module.exports.isLoggedIn = (req,res,next)=>{
    console.log('Request......',req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error',"You Must be Signed in !!")
        return res.redirect('/login')
    }
    next()
}

