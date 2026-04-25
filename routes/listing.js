const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


// INDEX + CREATE
router.route("/")
  .get(wrapAsync(listingController.index)) // GET /listings
  .post(
    isLoggedIn,
    upload.single('listing[image]'), 
     validateListing,
    wrapAsync(listingController.createListing) // ✅ wrap controller
  );


// NEW FORM
router.get("/new", isLoggedIn, listingController.renderNewForm); // GET /listings/new

// SHOW + UPDATE + DELETE
router.route("/:id")
  .get(wrapAsync(listingController.showListing)) // GET /listings/:id
  .put(isLoggedIn, isOwner, upload.single('listing[image]'),  validateListing, wrapAsync(listingController.updateListing)) // PUT /listings/:id
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // DELETE /listings/:id

// EDIT FORM
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)); // GET /listings/:id/edit

module.exports = router;
