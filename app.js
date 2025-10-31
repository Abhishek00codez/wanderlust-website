const express=require("express");
const app =express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
    .then((res)=>{
        console.log("connection successful");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}
//Index Route
app.get("/listings",async (req,res) => {
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});

//New Route //if we write this new route below the show route then show error.it think the new in url as id
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings",async (req,res)=>{
    // let {title,description,image,.....} method 1 to extract data
    //method 2: change the name in new.ejs into listing[]
    let listing =req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings")
});

//Show Route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Update route
//Edit route 
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update route
app.put("/listings/:id",async (req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.get("/",(req,res)=>{
    res.send("Sending");
});

app.listen(8080,()=>{
    console.log("server is listening");
})