require("dotenv").config();//to use .env file
const express=require("express");
const app =express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const multer=require("multer");//for image upload
const upload=multer({dest:"uploads/"});//save uploaded files to uploads folder


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
 
main()
    .then((res)=>{
        console.log("connection successful");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7, //7 days in milliseconds
        maxAge:1000*60*60*24*7,
        httpOnly:true,//to prevent cross site scripting attacks
    }
};

app.use(session(sessionOptions));
app.use(flash());//1st flash then route

//passport initialization
app.use(passport.initialize());//middleware that initialize passport
app.use(passport.session());//to make sure user logged in one time in one session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//store user in session
passport.deserializeUser(User.deserializeUser());//get user from session

//flash middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    console.log(res.locals.success);
    res.locals.currUser=req.user; //req.user is provided by passport.js
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);

// app.get("/",(req,res)=>{
//     res.send("Sending");
// });

//demo user
// app.get("/demouser",async(req,res)=>{
//     const user=new User({
//         username:"demouser",
//         email:"demouser@example.com"});
//     const newUser=await User.register(user,"demopassword");
//     res.send(newUser);
// });


//for user undefined routes
app.use((req,res,next)=>{   
    next(new ExpressError("Page Not Found",404));
});

app.use((err,req,res,next)=>{
     let {statusCode=500, message="Something went wrong"}=err;
     res.render("listings/error.ejs",{err});
    //  res.status(statusCode).send(message);  
});

app.listen(8080,()=>{
    console.log("server is listening");
})