const express=require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapasync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isowner}=require("../middleware.js")
const listingcontroller=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })

const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
      let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errmsg)
    }
    else{
        next()
    }
}

//index route
router.get("/",wrapAsync(listingcontroller.index));

  //new route
router.get("/new", isLoggedIn,listingcontroller.renderNewForm);

  //show route
router.get("/:id",wrapAsync( listingcontroller.showListing));

//create route 
router.post("/",isLoggedIn,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.createListing));



//edit route
router.get("/:id/edit",isLoggedIn,isowner,wrapAsync(listingcontroller.editListing));
//update route
router.patch("/:id",isLoggedIn,isowner,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.updateListing));
//delete route
router.delete("/:id",isLoggedIn,isowner,wrapAsync( listingcontroller.deleteListing));

module.exports = router;
