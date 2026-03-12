const User = require("../models/user.js");

module.exports.signup=async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        if (password.length < 8) {
            req.flash("error", "Password must be at least 8 characters long");
            return res.redirect("/signup");
        }
        const user=new User({username,email});
        const newUser=await User.register(user,password);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }   
};

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
} 

module.exports.login=async(req,res)=>{  
    req.flash("success","Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings"); //   || "/listings" is a default redirect if redirectUrl is not set(e.g., user directly goes to /login)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    });
}