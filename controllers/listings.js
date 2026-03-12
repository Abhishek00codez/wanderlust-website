const Listing=require("../models/listing.js");

const CATEGORIES=["Apartment","House","Villa","Condo","Cabin","Cottage","Bungalow","Farmhouse","Other"];

module.exports.index=async (req,res) => {
   const {page=1,search,category}=req.query;
   const limit=9;
   const filter={};

   if(search){
       const searchRegex=new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');
       filter.$or=[
           {title:searchRegex},
           {location:searchRegex},
           {country:searchRegex},
       ];
   }

   if(category && category!=="All"){
       filter.category=category;
   }

   const totalListings=await Listing.countDocuments(filter);
   const totalPages=Math.ceil(totalListings/limit) || 1;
   const currentPage=Math.min(Math.max(parseInt(page)||1,1),totalPages);

   const allListings=await Listing.find(filter)
       .skip((currentPage-1)*limit)
       .limit(limit);

   res.render("listings/index.ejs",{
       allListings,
       currentPage,
       totalPages,
       search:search||'',
       category:category||'All',
       categories:CATEGORIES,
   });
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{path:"author"},
    })
    .populate("owner");
    if (!listing) {
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }   
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res)=>{
    // let {title,description,image,.....} method 1 to extract data
    //method 2: change the name in new.ejs into listing[]
    let listing =req.body.listing;
    const newListing = new Listing(listing);
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
    }
    newListing.owner=req.user._id; //assigning owner to the listing 
    await newListing.save();
    req.flash("success","Successfully created a new listing");
    res.redirect("/listings");
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
        if (!listing) {
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing=async (req,res)=>{
    //remove after using validateListing(joi schema)
    // if(!req.body.listing){
    //     throw new ExpressError("Invalid Listing Data",400);
    // } 
     let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};}
    await listing.save();
    req.flash("success","Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the listing");
    res.redirect("/listings");
};