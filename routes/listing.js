const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //uploads(stores) files in cloudinary storage

//Index route (which shows all listings) and Create route (for creating new listing)
router // router.route() is used to define multiple handlers for different HTTP methods on the same route
  .route("/") // Specifies the root ("/") endpoint
  .get(wrapAsync(listingController.index)) // Handle GET requests
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing) // Handle POST requests with middleware for the same endpoint
  );

//New Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Update and Delete Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
