var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//===============
//Comment Routes
//===============

//new form
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
})
//new post
router.post("/", middleware.isLoggedIn, (req, res) => {
	//lookup campground
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
                    req.flash("error", "Something went wrong");
					console.log(err);
				} else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
					campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "You added a mother fucking campground comment bitch");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComments) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// COMMMENT DESTROY

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
        res.redirect("back");
        } else {
            req.flash("success", "Bitch that comment is gone boi bye");
            res.redirect("/campgrounds/" + req.params.id);
        }
    }) 
});



module.exports = router;