const express=require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewscontroller=require("../controllers/reviews.js")

const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
      let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errmsg)
    }
    else{
        next()
    }
  }
//review
// post review route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewscontroller.createreview))
  //delete review route 
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewscontroller.deletereview))
module.exports = router;