var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment");
var middleware = require("../middleware");



//Index
router.get("/", (req, res) => {
	//Get all campgrounds from db
	Campground.find({}, (err, allCampgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		} 
	});
});

//CREATE 
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
	var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
            console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	})
});

//NEW FORM
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

//SHOW Info
router.get("/:id", (req, res) => {
	//find campground with ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>{
        Campground.findById(req.params.id, (err, foundCampground) => {
             res.render("campgrounds/edit", {campground: foundCampground})
        });
});

//Update campground route
router.put("/:id", (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,(err, updatedCampground) => {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if(err){
            console.log(err);
        }
        Comment.deleteMany({_id: { $in: campgroundRemoved.comments}}, (err) => {
            if (err){
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

module.exports = router;