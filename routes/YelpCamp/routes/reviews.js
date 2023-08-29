const express = require('express');
const router = express.Router({ mergeParams: true });

const reviews = require('../controllers/reviews')


// const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')


// No need to add the reviewAther here 
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))


// router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     review.auther = req.user._id;
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     req.flash('success', 'Created new review!');
//     res.redirect(`/campgrounds/${campground._id}`);
// }))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;