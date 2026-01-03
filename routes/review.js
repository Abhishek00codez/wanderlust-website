const express=require("express");
const router=express.Router({mergeParams:true});//mergeParams:true;to access item that present in parent router,we have to use in child router.If i dont use this then id in params will be undefined.
const wrapAsync=require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing=require("../models/listing.js");
const {isReviewAuthor, validateReview, isLoggedIn } = require("../middleware.js");

const reviewController=require("../controllers/reviews.js");
//Review
//post route for adding review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;