const express=require("express")
const router = express.Router({mergeParams:true})
const User=require("../models/user.js")
const wrapasync = require("../utils/wrapasync.js")
const passport = require("passport")
const {saveRedirectUrl}=require("../middleware.js")
const usercontroller=require("../controllers/users.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})
router.post("/signup",wrapasync(usercontroller.signup))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),usercontroller.login)
router.get("/logout",usercontroller.logout)

module.exports = router;