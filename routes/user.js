const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const rateLimit=require("express-rate-limit");

const userController=require("../controllers/users.js");

const authLimiter=rateLimit({
    windowMs:15*60*1000,
    max:20,
    message:"Too many attempts, please try again after 15 minutes",
    standardHeaders:true,
    legacyHeaders:false,
});

router.get("/signup",userController.renderSignup);

router.post("/signup",authLimiter,wrapAsync(userController.signup));

router.get("/login",userController.renderLogin);

router.post("/login",
    authLimiter,
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true  
}),wrapAsync(userController.login));

router.get("/logout",userController.logout); 

module.exports=router;