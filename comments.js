// Create web server

// Import modules
const express = require('express');
const router = express.Router();

// Import model
const Comment = require('../models/comment');

// Import middleware
const { isLoggedIn, checkCommentOwnership } = require('../middleware');

// ======================
// Comment Routes
// ======================

// New comment
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found!');
            res.redirect('back');
        } else {
            res.render('comments/new', { campground: foundCampground });
        }
    });
});

// Create comment
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found!');
            res.redirect('/campgrounds');
        } else {
            // Create new comment
            Comment.create(req.body.comment, (err, newComment) => {
                if (err || !newComment) {
                    req.flash('error', 'Something went wrong!');
                    res.redirect('/campgrounds');
                } else {
                    // Add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // Save comment
                    newComment.save();
                    // Connect new comment to campground
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    // Redirect to campground show page
                    req.flash('success', 'Successfully added comment!');
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            });
        }
    });
});

// Edit comment
router.get('/campgrounds/:id/comments/:comment_id/edit', checkCommentOwnership, (req, res) => {
    // Find comment by id
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
            req.flash('error', 'Comment not found!');
            res.redirect('back');
        } else {
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
        }
    });