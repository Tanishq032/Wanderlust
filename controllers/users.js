const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      //Thsis function automatically logs in the user , after user's signIn.
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Wanderlust!!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  //Above is a passport middlware,
  //passport.authenticate(strategy, options)
  req.flash("success", "Welcome back to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listings"; //if res.locals.redirectUrl is undefined ; use "/listings" instead
  res.redirect(redirectUrl); // Redirect the user to the URL from which he initiated login request
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    // Check if there was an error during the logout process
    if (err) {
      // If there's an error, pass it to the next middleware to handle the error properly
      return next(err);
    }
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
};
