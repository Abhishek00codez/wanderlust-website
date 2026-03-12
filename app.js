require("dotenv").config();
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
const helmet=require("helmet");
const morgan=require("morgan");
const sanitizeHtml=require("sanitize-html");
const MongoStore=require("connect-mongo").MongoStore;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(helmet({contentSecurityPolicy:false}));

// Sanitize all string inputs in req.body (defense-in-depth against XSS)
app.use((req,res,next)=>{
    if(req.body) sanitizeObject(req.body);
    next();
});
function sanitizeObject(obj){
    for(const key in obj){
        if(typeof obj[key]==="string"){
            obj[key]=sanitizeHtml(obj[key],{allowedTags:[],allowedAttributes:{}});
        } else if(typeof obj[key]==="object" && obj[key]!==null){
            sanitizeObject(obj[key]);
        }
    }
}

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");

const dbUrl=process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/wanderlust';
 
main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{ secret:process.env.SESSION_SECRET || "mysupersecretcode" },
    touchAfter:24*3600,
});
store.on("error",(err)=>{ console.log("SESSION STORE ERROR",err); });

const sessionOptions={
    store,
    secret:process.env.SESSION_SECRET || "mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);

app.use((req,res,next)=>{   
    next(new ExpressError("Page Not Found",404));
});

app.use((err,req,res,next)=>{
     let {statusCode=500, message="Something went wrong"}=err;
     res.status(statusCode).render("listings/error.ejs",{err});
});

const port=process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})