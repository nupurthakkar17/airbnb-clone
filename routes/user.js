const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// SIGNUP ROUTE
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// LOGIN ROUTE
router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

// LOGOUT ROUTE (still a single GET route)
router.get("/logout", userController.logout);

module.exports = router;
