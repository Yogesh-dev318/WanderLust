const Listing=require("./models/listing.js")
const Review = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      //redirecturl
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to create Listings!")
    return res.redirect("/login")
  }
  next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
}
module.exports.isowner=async(req,res,next)=>{
  let { id } = req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permission to edit");
    return res.redirect(`/listings/${id}`)
  }
  next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  let { id,reviewId } = req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review!");
    return res.redirect(`/listings/${id}`)
  }
  next();
}