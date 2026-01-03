const User = require("../models/user.js");

module.exports.signup=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const user=new User({username,email});
        const newUser=await User.register(user,password);   
        console.log(newUser);
        req.login(newUser,(err)=>{  //to log in user after sign up
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

module.exports.logout=(req,res)=>{
    req.logout((err)=>{   //req.logout take a callback function as parameter
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    });
}