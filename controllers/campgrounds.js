const { model } = require("mongoose")
const Campground = require('../models/campground')
const { cloudinary } = require("../cloudinary")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    // .populate({
    //     path:'popupText',
    //     strictPopulate:false})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        strictPopulate: false,
        populate: {
            path: 'author'
        }
    }).populate('author')
    // const campground = await Campground.findById(req.params.id).populate('reviews');


    console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    console.log(campground)
    res.render('campgrounds/show', { campground })
}


module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit: 1

    }).send()
        
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;

    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground.geometry.coordinates)
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}
////////////////////////////////////////////////////////////
// async (req, res, next) => {
//     // if(!req.body.campground) throw new ExpressError()

//     const campground = new Campground(req.body.campground)
//     // Saving the auther of the created camp
//     campground.author = req.user._id
//     // console.log(req.body.campground)
//     await campground.save()
//     // req.flash('success','CampGround Added successfuly')
//     req.flash('success', 'Successfully made a new campground!');

//     res.redirect(`/campgrounds/${campground._id}`)
// }


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.geometry
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }
    // await campground.save();

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}