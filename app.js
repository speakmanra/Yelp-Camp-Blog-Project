var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seed");
methodOveride = require("method-override");

var commentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index"),
  campgroundRoutes = require("./routes/campgrounds");

// seedDB();

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://speakmanra:Sepideh1129!!@cluster0-jvysz.mongodb.net/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOveride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

//Passport Config
app.use(
  require("express-session")({
    secret: "Appa Tigger",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//Listen Up
app.listen(process.env.PORT || 2000, () => {
  console.log("server has started");
});
