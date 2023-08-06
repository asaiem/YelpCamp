const express = require('express')
const router = express.Router()

const Joi = require('joi')
const { campgroundSchema } = require('../schemas.js')

const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')

const campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')


const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    // let  msg;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
    // console.log(msg);
}







router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    req.flash('success', 'Successfully made a new campground!');
    res.render('campgrounds/index', { campgrounds })
}))



router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    console.log(campground)
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))


router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError()

    const campground = new Campground(req.body.campground)
    // console.log(req.body.campground)
    await campground.save()
    // req.flash('success','CampGround Added successfuly')
    req.flash('success', 'Successfully made a new campground!');
    
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    console.log('campground')
    
        req.flash('success', 'Successfuly Updated the campground');
        res.redirect(`/campgrounds/${campground._id}`)
}))
router.post('/:id/reviews', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)

}))
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/campgrounds`)
    
}))

module.exports = router