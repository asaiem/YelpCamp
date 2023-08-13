const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Campground = require('./models/campground')
const Review = require('./models/review')

// Exports ROUTES 
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const usersRoutes =require('./routes/users')
//auth requireing 
const passport = require('passport')
const LocalStaretgy = require('passport-local')



const User = require('./models/user')
const mongoose = require('mongoose')
const campground = require('./models/campground')
const catchAsync = require('./utils/catchAsync')
// const exp = require('constants')

const session = require('express-session');
const flash = require('connect-flash')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log(" Mongo CONNECTEDD")
    })
    .catch((err) => {
        console.log("OHH Mongo Error Connection")
        console.log(err)

    })

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.render('home')
})



//to use PUT or PATCH with form
methodOverride = require('method-override')
app.use(methodOverride('_method'))

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

const validateReview = (req, res, next) => {
    const { error } = validateReview.validate(req.body);
    // let  msg;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}



    
const sessionConfig = {
    secret: 'this is sesson secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7

    }

}

app.use(session(sessionConfig))
app.use(flash())


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//Auth should be after session
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStaretgy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/fakeuser', async (req, res) => {
    const user = User({
        email: 'bedo@gm.com',
        username: "sayem"
    })
    const newUser = await User.register(user, 'colt')
    res.send(newUser)
})

app.use('/', usersRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)



app.get('/', (req, res) => {
    res.render('home')
});

app.all("*", (req, res, next) => {
    next(new ExpressError('Page NOT fouNd'), 404);
})

app.use((err, req, res, next) => {
    const { statusCode = 500, } = err;
    if (!err.message) err.message = ' OOH Something goes Wrong'
    res.status(statusCode).render("error", { err })
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})




// app.get('/makecampground',async(req,res)=>{
//     const camp = new Campground({title:"My BackYard"})
//     await camp.save()
//     res.send(camp)
// })