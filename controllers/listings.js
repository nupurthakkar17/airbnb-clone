const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success", "New Listing Created !");
  res.redirect("/listings");
};

// SHOW LISTING
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

let originalImageUrl=listing.image.url;
 originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
res.render("listings/edit.ejs",{listing,originalImageUrl});
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // If image was uploaded, update it
    if (req.file) {
     
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error while updating listing:", err);
    req.flash("error", "Failed to update listing.");
    res.redirect("/listings");
  }
};


// DELETE LISTING
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
