const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    let review=new Review(req.body.review);
    review.author=req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Successfully added a new review");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async (req,res)=>{
    const {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review");
    res.redirect(`/listings/${id}`);
};