const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js"); 
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });

const listingController=require("../controllers/listings.js");

//Index Route && //Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));
//Update route and Show Route && delete route 

//New Route //if we write this new route below the show route then show error.it think the new in url as id
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


//Edit route 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports=router;
