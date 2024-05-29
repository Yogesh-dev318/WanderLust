if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
// console.log(process.env)

const express = require("express");
const app = express();
let port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
var methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const Review = require("./models/review.js");
const listingrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

// const mongourl="mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL

main()
  .then((result) => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dburl);
}

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("Error in Mongo Session stroe",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}
// app.get("/",(req,res)=>{
//   res.send("hi i am root")
// })



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  console.log(res.locals.success)
  next()
})
app.use("/",userrouter)
app.use("/listings", listingrouter);
app.use("/listings/:id/reviews",reviewsrouter)


// app.get("/", (req, res) => {
//   res.send("Hello");
// });

app.all("*",(req,res,next)=>{
    throw new ExpressError(404,"Page Not Found")
})

app.use((err, req, res, next) => {
    let {statuscode=500,message="Something went wrong!"}=err
    // res.status(statuscode).send(message)
    res.status(statuscode).render("./listings/error.ejs",{message})
});

app.listen(port, () => {
  console.log("Server Connected with port", port);
});

