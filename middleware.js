const Listing=require("./models/listing"); 
const Review=require("./models/review"); 

const ExpressError=require("./utils/ExpressError");
const { listingSchema , reviewSchema } = require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url if not logged in
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in first");
        return res.redirect("/login");
    }
    next();
}   
   
//passport.js delete user info from session automatically
// but if we want to delete some other info from session then we have to do it manually
module.exports.saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
    next();
}   

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}       

module.exports.validateListing=(req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if (error) {
        const errmessage = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errmessage, 400);
    }
    else{
        next();
    }
};
module.exports.validateReview=(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const errmessage = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errmessage, 400);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}  