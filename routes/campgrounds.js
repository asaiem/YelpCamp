const express = require('express')
const router = express.Router()

const Joi = require('joi')
const { campgroundSchema } = require('../schemas.js')

const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const multer  = require('multer')
const {storage} = require('../cloudinary')

const upload = multer({ storage })


const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


router.get('/', catchAsync(campgrounds.index))
router.post('/', isLoggedIn, upload.array('images'),validateCampground, catchAsync(campgrounds.createCampground))
// router.post('/', upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files)
//     res.send('Worked')
// })



router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id', isLoggedIn, catchAsync(campgrounds.showCampground))

//updating campground

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
// put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


//IMPORTANT to MAKE router Working
module.exports = router