const User=require("../models/user.js")

module.exports.signup=async (req,res)=>{
    try{
        let{username,email,password} = req.body
    const newuser=new User({username,email})
    let registeredUser=await User.register(newuser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome to Wanderlust")
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}
module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to your account. You are Logged in succesfully!")
    let redirecturl=res.locals.redirectUrl || "/listings"
    console.log(req.user)
    res.redirect(redirecturl)
}
module.exports.logout=(req,res,next)=>{
    req.logOut((error)=>{
        if(error){
            return next(error)
        }
        req.flash("success","You are Logged Out");
        res.redirect("/listings")
    })
}